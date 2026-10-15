import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import { getSensorWorldTransform } from "../components/Sensors/SensorViewer/sensorConstants";
import Layout from "../components/Layout/Layout";
import Earth from "../components/Scene/Earth";
import StarsField from "../components/Scene/StarsField";
import "./DatasetGenerator.css";
import JSZip from "jszip";

const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 480;
const MAX_SATELLITES = 5;

/**
 * Computes a validated 2D pixel & normalized YOLO bounding box for a satellite instance.
 * Rejects empty, degenerate, or completely off-screen objects.
 */
function compute2DBoundingBox(group, camera, imageWidth, imageHeight, idNum) {
  if (!group || !group.visible) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let visiblePointCount = 0;

  // Pre-calculate camera view-projection matrix for rapid vertex transformation
  const viewProj = new THREE.Matrix4().multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );
  const mvp = new THREE.Matrix4();

  // Traverse all meshes in the satellite instance and project exact physical vertices
  group.traverse((child) => {
    if (
      child.isMesh &&
      child.visible &&
      child.geometry &&
      child.geometry.attributes &&
      child.geometry.attributes.position
    ) {
      const pos = child.geometry.attributes.position;
      const count = pos.count;
      if (count === 0) return;

      // Model-View-Projection matrix for this specific mesh component
      mvp.multiplyMatrices(viewProj, child.matrixWorld);
      const e = mvp.elements;

      for (let i = 0; i < count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        // Vector4 transform: (MVP * [x, y, z, 1]^T)
        const w = e[3] * x + e[7] * y + e[11] * z + e[15];
        if (w > 0) {
          const invW = 1 / w;
          const ndcZ = (e[2] * x + e[6] * y + e[10] * z + e[14]) * invW;

          // In Three.js NDC, z between -1 (near plane) and 1 (far plane) indicates point is in front of camera
          if (ndcZ >= -1 && ndcZ <= 1) {
            visiblePointCount++;
            const px =
              ((e[0] * x + e[4] * y + e[8] * z + e[12]) * invW + 1) *
              0.5 *
              imageWidth;
            const py =
              (1 - (e[1] * x + e[5] * y + e[9] * z + e[13]) * invW) *
              0.5 *
              imageHeight;

            if (px < minX) minX = px;
            if (px > maxX) maxX = px;
            if (py < minY) minY = py;
            if (py > maxY) maxY = py;
          }
        }
      }
    }
  });

  // Reject if no corners are in front of camera or coordinates are invalid
  if (
    visiblePointCount === 0 ||
    !Number.isFinite(minX) ||
    !Number.isFinite(maxX) ||
    !Number.isFinite(minY) ||
    !Number.isFinite(maxY)
  ) {
    return null;
  }

  // Reject if completely outside the 2D frame
  if (maxX <= 0 || minX >= imageWidth || maxY <= 0 || minY >= imageHeight) {
    return null;
  }

  // Clamp strictly to frame boundaries
  const clampedMinX = Math.max(0, Math.min(imageWidth, minX));
  const clampedMaxX = Math.max(0, Math.min(imageWidth, maxX));
  const clampedMinY = Math.max(0, Math.min(imageHeight, minY));
  const clampedMaxY = Math.max(0, Math.min(imageHeight, maxY));

  const boxWidth = clampedMaxX - clampedMinX;
  const boxHeight = clampedMaxY - clampedMinY;

  // Reject tiny sub-pixel artifacts or slivers (< 4 pixels)
  if (boxWidth < 4 || boxHeight < 4) {
    return null;
  }

  // YOLO normalized coordinates in [0, 1]
  const normCenterX = (clampedMinX + boxWidth / 2) / imageWidth;
  const normCenterY = (clampedMinY + boxHeight / 2) / imageHeight;
  const normWidth = boxWidth / imageWidth;
  const normHeight = boxHeight / imageHeight;

  if (
    normCenterX <= 0 ||
    normCenterX >= 1 ||
    normCenterY <= 0 ||
    normCenterY >= 1 ||
    normWidth <= 0 ||
    normWidth > 1 ||
    normHeight <= 0 ||
    normHeight > 1
  ) {
    return null;
  }

  return {
    id: `SAT-${String(idNum).padStart(3, "0")}`,
    classId: 0,
    className: "satellite",
    x: clampedMinX,
    y: clampedMinY,
    width: boxWidth,
    height: boxHeight,
    normCenterX,
    normCenterY,
    normWidth,
    normHeight,
  };
}

/**
 * 3D Scene containing the RGB-D sensor camera, Earth, Stars, lighting, and satellite instances.
 * Provides direct, synchronous rendering, position/lighting randomization, and frame capture.
 */
function GeneratorScene({ controllerRef, count, onBoxesReady }) {
  const { camera, gl, scene } = useThree();
  const { scene: gltfScene } = useGLTF("/models/satellite.glb");
  const groupsRef = useRef([]);
  const earthRef = useRef();

  // Dynamic lighting refs for varied lighting conditions
  const sunLightRef = useRef();
  const ambientLightRef = useRef();
  const hemiLightRef = useRef();
  const headlightRef = useRef();

  // Position camera at RGB-D sensor mount
  useEffect(() => {
    const chaserPosition = { x: 4.8, y: 0, z: 0 };
    const transform = getSensorWorldTransform(chaserPosition, "RGB-D Camera");

    camera.position.copy(transform.position);
    camera.quaternion.copy(transform.quaternion);
    camera.updateMatrixWorld(true);
    camera.updateProjectionMatrix();
  }, [camera]);

  // Pre-instantiate up to MAX_SATELLITES meshes, properly centered so rotations occur around true geometric centroid
  const satellites = useMemo(() => {
    // Compute geometric centroid of the raw GLTF satellite hierarchy
    const bbox = new THREE.Box3().setFromObject(gltfScene);
    const center = new THREE.Vector3();
    bbox.getCenter(center);

    return Array.from({ length: MAX_SATELLITES }, (_, index) => {
      const cloned = gltfScene.clone(true);

      // Shift child geometries/position by -center so (0,0,0) is the satellite's exact center
      cloned.position.sub(center);

      cloned.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material = child.material.clone();
          // Enhance dark materials: lift near-black base colors for spacecraft visibility
          if (child.material.color) {
            const { r, g, b } = child.material.color;
            if (r < 0.25 && g < 0.25 && b < 0.25) {
              child.material.color.setRGB(
                Math.max(r * 2.5, 0.32),
                Math.max(g * 2.5, 0.32),
                Math.max(b * 2.5, 0.36)
              );
            }
          }
          // Prevent metallic surfaces from acting as pure black mirrors without envmap
          if (
            child.material.metalness !== undefined &&
            child.material.metalness > 0.3
          ) {
            child.material.roughness = Math.max(child.material.roughness || 0, 0.42);
            child.material.metalness = Math.min(child.material.metalness, 0.55);
          }
        }
      });
      return {
        id: index + 1,
        object: cloned,
      };
    });
  }, [gltfScene]);

  // Randomize lighting and background environment (Earth position/rotation, sun angles/intensities)
  const randomizeEnvironment = useCallback(() => {
    // 1. Varied Solar Key Light (angles, intensity 1.5 - 4.5, warm sunlight hue)
    if (sunLightRef.current) {
      const sunTheta = Math.random() * Math.PI * 2;
      const sunPhi = 0.2 + Math.random() * 1.2;
      const sunDist = 12.0;
      sunLightRef.current.position.set(
        4.8 + sunDist * Math.sin(sunPhi) * Math.cos(sunTheta),
        sunDist * Math.cos(sunPhi),
        sunDist * Math.sin(sunPhi) * Math.sin(sunTheta)
      );
      sunLightRef.current.intensity = 1.6 + Math.random() * 2.6;
      const colorTemp = 0.9 + Math.random() * 0.1;
      sunLightRef.current.color.setRGB(1.0, colorTemp, colorTemp * 0.92);
    }

    // 2. Varied Ambient and Earthshine bounce intensity
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = 0.6 + Math.random() * 0.8;
    }
    if (hemiLightRef.current) {
      hemiLightRef.current.intensity = 0.8 + Math.random() * 1.0;
    }

    // 3. Sensor Headlight (flash/work light from chaser)
    if (headlightRef.current) {
      headlightRef.current.intensity = 1.0 + Math.random() * 2.2;
    }

    // 4. Position Earth reliably within the camera FOV (in front of camera along optical axis -Z)
    if (earthRef.current) {
      // Camera looks along its local -Z axis. Position Earth at 30-45m in front of camera
      const earthDist = 32 + Math.random() * 12;
      // Slight horizontal variation, placed in lower half of frame so limb is majestic background
      const localEarthX = (Math.random() - 0.5) * 6;
      const localEarthY = -8 - Math.random() * 4;
      const localEarthZ = -earthDist;

      const earthWorldPos = camera.localToWorld(new THREE.Vector3(localEarthX, localEarthY, localEarthZ));
      earthRef.current.position.copy(earthWorldPos);

      // Varied Earth rotation & scale (realistic planetary limb occupying background)
      earthRef.current.rotation.set(
        Math.random() * 0.4,
        Math.random() * Math.PI * 2,
        Math.random() * 0.4
      );
      const earthScale = 14 + Math.random() * 4;
      earthRef.current.scale.setScalar(earthScale);
      earthRef.current.updateMatrixWorld(true);
    }
  }, [camera]);

  // Synchronously randomize 3D positions, orientations, and scale for active satellites
  // isNegative: when true, all satellites are hidden (generating negative background samples)
  const randomizePositions = useCallback(
    (activeCount, isNegative = false) => {
      camera.updateMatrixWorld(true);
      randomizeEnvironment();

      for (let i = 0; i < MAX_SATELLITES; i++) {
        const group = groupsRef.current[i];
        if (!group) continue;

        if (!isNegative && i < activeCount) {
          group.visible = true;

          // Proximity range: 2.3m to 4.2m ensures complete satellite & solar panels remain inside FOV
          const dist = 2.4 + Math.random() * 1.8;
          const halfH = Math.tan((60 * Math.PI / 180) / 2) * dist;
          const halfW = halfH * (IMAGE_WIDTH / IMAGE_HEIGHT);

          // Controlled spread across frame so satellites do not overlap excessively or clip frame
          let localX, localY;
          if (activeCount === 1) {
            localX = (Math.random() - 0.5) * 0.35 * halfW;
            localY = (Math.random() - 0.5) * 0.35 * halfH;
          } else {
            const angle = (i / activeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
            const radiusNorm = 0.15 + Math.random() * 0.28;
            localX = Math.cos(angle) * halfW * radiusNorm;
            localY = Math.sin(angle) * halfH * radiusNorm;
          }
          const localZ = -dist;

          const local = new THREE.Vector3(localX, localY, localZ);
          const worldPosition = camera.localToWorld(local);
          group.position.copy(worldPosition);

          // Full 3D rotation variability across all 3 Euler axes (realistic spacecraft attitude)
          group.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          );

          // Scaled appropriately (0.08 - 0.13) so wingspan fits camera FOV cleanly
          const scaleFactor = 0.08 + Math.random() * 0.05;
          group.scale.setScalar(scaleFactor);
          group.updateMatrixWorld(true);
        } else {
          // Hide satellite (either disabled slot or negative sample)
          group.visible = false;
          group.position.set(0, -9999, 0);
          group.updateMatrixWorld(true);
        }
      }
    },
    [camera, randomizeEnvironment]
  );

  // Compute 2D bounding boxes for all currently visible satellites
  const computeBoxes = useCallback(
    (activeCount, isNegative = false) => {
      if (isNegative) return [];

      const boxes = [];
      for (let i = 0; i < activeCount; i++) {
        const group = groupsRef.current[i];
        if (!group || !group.visible) continue;

        const box = compute2DBoundingBox(
          group,
          camera,
          IMAGE_WIDTH,
          IMAGE_HEIGHT,
          i + 1
        );
        if (box) {
          boxes.push(box);
        }
      }
      return boxes;
    },
    [camera]
  );

  // Synchronously render to WebGL canvas, compute exact matching boxes, and capture frame
  const renderAndCapture = useCallback(
    (activeCount, isNegative = false) => {
      camera.updateMatrixWorld(true);
      camera.updateProjectionMatrix();

      // Force immediate draw to the WebGL canvas buffer
      gl.render(scene, camera);

      // Compute bounding boxes for the exact rendered positions
      const boxes = computeBoxes(activeCount, isNegative);

      // Format standard YOLO labels (empty string if negative or no visible satellites)
      const yoloLabels = boxes.length > 0
        ? boxes
            .map((box) => {
              return `0 ${box.normCenterX.toFixed(6)} ${box.normCenterY.toFixed(6)} ${box.normWidth.toFixed(6)} ${box.normHeight.toFixed(6)}`;
            })
            .join("\n")
        : "";

      // Capture canvas pixel buffer as PNG data URL
      const imageData = gl.domElement.toDataURL("image/png");

      return {
        boxes,
        yoloLabels,
        imageData,
        isNegative,
      };
    },
    [camera, gl, scene, computeBoxes]
  );

  // Expose controller methods to parent component
  useEffect(() => {
    if (!controllerRef) return;

    controllerRef.current = {
      randomizeAndRender: (targetCount, isNegative = false) => {
        randomizePositions(targetCount, isNegative);
        return renderAndCapture(targetCount, isNegative);
      },
      captureCurrent: (targetCount, isNegative = false) => {
        return renderAndCapture(targetCount, isNegative);
      },
      generateSample: (targetCount, isNegative = false) => {
        randomizePositions(targetCount, isNegative);
        return renderAndCapture(targetCount, isNegative);
      },
    };
  }, [controllerRef, randomizePositions, renderAndCapture]);

  // Synchronize on mount and whenever satelliteCount dropdown changes
  useEffect(() => {
    if (satellites.length > 0) {
      randomizePositions(count, false);
      const res = renderAndCapture(count, false);
      if (onBoxesReady) {
        onBoxesReady(res.boxes);
      }
    }
  }, [satellites, count, randomizePositions, renderAndCapture, onBoxesReady]);

  // Target object positioned at the centroid of the satellites in front of the camera
  const lightTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(4.8, 0.12, 3.0);
    return target;
  }, []);

  return (
    <>
      {/* Light target at satellite cluster centroid */}
      <primitive object={lightTarget} />

      {/* Balanced space ambient light: fills dark shadows */}
      <ambientLight ref={ambientLightRef} intensity={1.2} color="#dbe7ff" />

      {/* Earthshine bounce light */}
      <hemisphereLight ref={hemiLightRef} args={["#9ec2f7", "#1a2a40", 1.4]} />

      {/* Sensor Headlight: Mounted near the RGB-D sensor, illuminating front-facing surfaces */}
      <directionalLight
        ref={headlightRef}
        position={[4.8, 1.2, 0.2]}
        target={lightTarget}
        intensity={2.5}
        color="#ffffff"
      />

      {/* Solar Key Light: Primary intense directional sunlight from varied angles */}
      <directionalLight
        ref={sunLightRef}
        position={[9.0, 7.0, -1.0]}
        target={lightTarget}
        intensity={3.2}
        color="#fff8ea"
      />

      {/* Deep space background elements from simulation */}
      <StarsField />

      {/* Realistic Earth background */}
      <group ref={earthRef}>
        <Earth isMini={false} />
      </group>

      <color attach="background" args={["#030712"]} />

      {satellites.map((satellite, index) => (
        <group
          key={satellite.id}
          ref={(element) => {
            groupsRef.current[index] = element;
          }}
        >
          <primitive object={satellite.object} />
        </group>
      ))}
    </>
  );
}

function DatasetGenerator() {
  const [satelliteCount, setSatelliteCount] = useState(3);
  const [totalSamples, setTotalSamples] = useState(200);
  const [boxes, setBoxes] = useState([]);
  const [sampleNumber, setSampleNumber] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const sceneControllerRef = useRef(null);

  const handleBoxesReady = useCallback((newBoxes) => {
    setBoxes(newBoxes);
  }, []);

  /**
   * Randomize current scene view without saving.
   */
  const handleRandomizeView = () => {
    if (!sceneControllerRef.current || isGenerating) return;
    const res = sceneControllerRef.current.randomizeAndRender(satelliteCount, false);
    setBoxes(res.boxes);
  };

  /**
   * Capture a single test sample ZIP for inspection.
   */
  const captureSample = async () => {
    if (!sceneControllerRef.current) {
      alert("Dataset scene is not ready yet.");
      return;
    }

    try {
      const sample = sceneControllerRef.current.captureCurrent(satelliteCount, false);
      if (!sample || sample.boxes.length === 0) {
        alert("No ground-truth bounding boxes available in current view.");
        return;
      }

      const zip = new JSZip();
      const sampleName = `satellite_${String(sampleNumber).padStart(4, "0")}`;

      const base64Data = sample.imageData.replace(
        /^data:image\/(png|jpeg);base64,/,
        ""
      );

      zip.file(`images/${sampleName}.png`, base64Data, { base64: true });
      zip.file(`labels/${sampleName}.txt`, sample.yoloLabels);
      zip.file("classes.txt", "satellite\n");
      zip.file(
        "dataset.yaml",
        `path: .
train: images
val: images

names:
  0: satellite
`
      );

      const zipBlob = await zip.generateAsync({
        type: "blob",
      });

      const url = URL.createObjectURL(zipBlob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `satellite_${String(sampleNumber).padStart(4, "0")}.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setSampleNumber((value) => value + 1);
    } catch (err) {
      console.error("Test capture error:", err);
      alert(`Capture failed: ${err.message}`);
    }
  };

  /**
   * Generate configurable unique synthetic samples (default 200) with an 80/20 train/validation split,
   * approx 15% negative samples containing Earth/stars but no satellite, accurate YOLO bounding boxes,
   * client-side validation of all labels, and relative dataset.yaml.
   */
  const generateDataset = async () => {
    if (!sceneControllerRef.current) {
      alert("Dataset scene is not ready yet.");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const zip = new JSZip();
      // 80% train, 20% val (e.g., 160 train / 40 val for 200 samples)
      const trainCount = Math.round(totalSamples * 0.8);

      // Designate ~15% evenly distributed samples as negatives (empty labels, Earth/stars only)
      // This guarantees ~15% negative rate across both train and val splits
      const negativeIndices = new Set();
      const targetNegativeCount = Math.round(totalSamples * 0.15);
      const step = totalSamples / targetNegativeCount;
      for (let k = 0; k < targetNegativeCount; k++) {
        // Offset by 3 to vary position and ensure distribution in both train and val
        const idx = Math.min(totalSamples, Math.max(1, Math.round((k + 0.5) * step)));
        negativeIndices.add(idx);
      }

      let totalBoxesGenerated = 0;
      let totalPositives = 0;
      let totalNegatives = 0;

      for (let i = 1; i <= totalSamples; i++) {
        const isNegative = negativeIndices.has(i);

        // Generate sample (if isNegative, satellites are hidden, earth/stars & lighting rendered)
        const sample = sceneControllerRef.current.generateSample(satelliteCount, isNegative);

        // Update live boxes in state so HUD and table reflect current sample
        setBoxes(sample.boxes);

        // Validate YOLO labels before adding to dataset
        if (isNegative) {
          totalNegatives++;
          if (sample.boxes.length !== 0 || sample.yoloLabels !== "") {
            throw new Error(`Negative sample #${i} produced non-empty bounding boxes!`);
          }
        } else {
          totalPositives++;
          totalBoxesGenerated += sample.boxes.length;
          // Validate box normalization constraints: [0, 1] range and non-zero area
          for (const box of sample.boxes) {
            if (
              box.classId !== 0 ||
              box.normCenterX <= 0 || box.normCenterX >= 1 ||
              box.normCenterY <= 0 || box.normCenterY >= 1 ||
              box.normWidth <= 0 || box.normWidth > 1 ||
              box.normHeight <= 0 || box.normHeight > 1
            ) {
              throw new Error(`Sample #${i} generated invalid YOLO normalized bbox: ${JSON.stringify(box)}`);
            }
          }
        }

        const sampleName = `satellite_${String(i).padStart(4, "0")}`;
        const subset = i <= trainCount ? "train" : "val";

        const base64Data = sample.imageData.replace(
          /^data:image\/(png|jpeg);base64,/,
          ""
        );

        zip.file(`images/${subset}/${sampleName}.png`, base64Data, {
          base64: true,
        });

        // YOLO specification: negative background images have an empty label file (.txt exists with length 0)
        zip.file(`labels/${subset}/${sampleName}.txt`, isNegative ? "" : sample.yoloLabels);

        setGenerationProgress(i);

        // Yield to browser event loop to allow progress bar & canvas to visually update
        await new Promise((resolve) => setTimeout(resolve, 25));
      }

      zip.file("classes.txt", "satellite\n");

      // Valid YOLO dataset.yaml with paths relative to dataset root
      zip.file(
        "dataset.yaml",
        `path: .
train: images/train
val: images/val

names:
  0: satellite
`
      );

      // Add a dataset metadata manifest for validation auditing
      zip.file(
        "dataset_metadata.json",
        JSON.stringify(
          {
            generatorVersion: "2.0-simulation-aligned",
            classId: 0,
            className: "satellite",
            totalSamples,
            trainSamples: trainCount,
            valSamples: totalSamples - trainCount,
            positiveSamples: totalPositives,
            negativeSamples: totalNegatives,
            negativePercentage: `${((totalNegatives / totalSamples) * 100).toFixed(1)}%`,
            totalBoundingBoxes: totalBoxesGenerated,
            averageBoxesPerPositive: (totalBoxesGenerated / (totalPositives || 1)).toFixed(2),
            backgroundElements: ["Earth", "StarsField", "DynamicSunLight", "EarthshineHemiLight"],
            resolution: { width: IMAGE_WIDTH, height: IMAGE_HEIGHT },
          },
          null,
          2
        )
      );

      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6,
        },
      });

      const url = URL.createObjectURL(zipBlob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `satellite_dataset_${totalSamples}_samples.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setSampleNumber((v) => v + totalSamples);
    } catch (err) {
      console.error("Dataset generation error:", err);
      alert(`Generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout showInspector={false} showFooter={false}>
      <div className="dataset-generator-page">
        <div className="dataset-generator-header">
          <div>
            <h1>Satellite Dataset Generator</h1>
            <p>RGB-D camera POV · Satellite-only synthetic dataset</p>
          </div>

          <div className="generator-status">
            <span>MODEL</span>
            <strong>satellite.glb</strong>
          </div>
        </div>

        <div className="dataset-generator-content">
          <div className="generator-viewer">
            <Canvas
              camera={{
                fov: 60,
                near: 0.1,
                far: 300,
                aspect: IMAGE_WIDTH / IMAGE_HEIGHT,
              }}
              gl={{
                preserveDrawingBuffer: true,
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.5,
              }}
              onCreated={({ gl: webglRenderer }) => {
                webglRenderer.toneMapping = THREE.ACESFilmicToneMapping;
                webglRenderer.toneMappingExposure = 1.5;
              }}
              dpr={1}
              style={{
                width: `${IMAGE_WIDTH}px`,
                height: `${IMAGE_HEIGHT}px`,
              }}
            >
              <GeneratorScene
                controllerRef={sceneControllerRef}
                count={satelliteCount}
                onBoxesReady={handleBoxesReady}
              />
            </Canvas>

            <div className="ground-truth-overlay">
              {boxes.map((box) => (
                <div
                  key={box.id}
                  className="ground-truth-box"
                  style={{
                    left: `${box.x}px`,
                    top: `${box.y}px`,
                    width: `${box.width}px`,
                    height: `${box.height}px`,
                  }}
                >
                  <span className="ground-truth-label">{box.id}</span>
                </div>
              ))}
            </div>

            <div className="generator-label">DATASET CAMERA · 640 × 480</div>
          </div>

          <div className="generator-controls">
            <h2>Dataset Generation</h2>

            <label>Number of satellites</label>
            <select
              value={satelliteCount}
              disabled={isGenerating}
              onChange={(event) => {
                setSatelliteCount(Number(event.target.value));
              }}
            >
              <option value={1}>1 Satellite</option>
              <option value={2}>2 Satellites</option>
              <option value={3}>3 Satellites</option>
              <option value={5}>5 Satellites</option>
            </select>

            <label>Dataset Size</label>
            <select
              value={totalSamples}
              disabled={isGenerating}
              onChange={(event) => {
                setTotalSamples(Number(event.target.value));
              }}
            >
              <option value={20}>20 Samples (Quick Test)</option>
              <option value={50}>50 Samples</option>
              <option value={100}>100 Samples</option>
              <option value={200}>200 Samples (Target Dataset)</option>
            </select>

            <button
              className="capture-dataset-button"
              disabled={isGenerating}
              onClick={handleRandomizeView}
              style={{
                marginBottom: "10px",
                background: "#16233b",
                borderColor: "#254167",
              }}
            >
              RANDOMIZE VIEW
            </button>

            <button
              className="capture-dataset-button"
              disabled={isGenerating}
              onClick={captureSample}
            >
              CAPTURE TEST SAMPLE
            </button>

            <button
              className="capture-dataset-button"
              disabled={isGenerating}
              onClick={generateDataset}
              style={{
                marginTop: "10px",
              }}
            >
              {isGenerating
                ? `GENERATING ${generationProgress} / ${totalSamples}`
                : `GENERATE ${totalSamples} SAMPLES`}
            </button>

            <div className="box-results">
              <h3>Ground Truth</h3>

              {boxes.length === 0 ? (
                <p>Waiting for bounding boxes...</p>
              ) : (
                boxes.map((box) => (
                  <div className="box-row" key={box.id}>
                    <strong>{box.id}</strong>
                    <span>
                      x:{box.x.toFixed(0)} y:{box.y.toFixed(0)}
                    </span>
                    <span>
                      w:{box.width.toFixed(0)} h:{box.height.toFixed(0)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="generator-note">
              <strong>Class ID 0</strong>
              <span>satellite</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

useGLTF.preload("/models/satellite.glb");

export default DatasetGenerator;