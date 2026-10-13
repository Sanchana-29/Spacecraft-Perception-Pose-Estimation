import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import { getSensorWorldTransform } from "../components/Sensors/SensorViewer/sensorConstants";
import "./DatasetGenerator.css";
import JSZip from "jszip";

const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 480;
const TOTAL_SAMPLES = 20;

function SatelliteInstances({ count, sceneVersion, onBoxesReady }) {
  const { scene } = useGLTF("/models/satellite.glb");
  const { camera, gl } = useThree();
  const groupsRef = useRef([]);

  const satellites = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const cloned = scene.clone(true);

      cloned.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
        }
      });

      return {
        id: index + 1,
        object: cloned,

        localPosition: {
          x: (Math.random() - 0.5) * 2.8,
          y: (Math.random() - 0.5) * 1.8,
          z: -(6 + Math.random() * 4),
        },

        rotation: {
          x: Math.random() * Math.PI,
          y: Math.random() * Math.PI * 2,
          z: Math.random() * Math.PI,
        },

        scale: 0.08,
      };
    });
  }, [scene, count, sceneVersion]);

  useFrame(() => {
    if (!camera || !gl) return;

    camera.updateMatrixWorld(true);
    camera.updateProjectionMatrix();

    const boxes = [];

    satellites.forEach((satellite, index) => {
      const group = groupsRef.current[index];

      if (!group) return;

      const local = new THREE.Vector3(
        satellite.localPosition.x,
        satellite.localPosition.y,
        satellite.localPosition.z
      );

      const worldPosition = camera.localToWorld(local);

      group.position.copy(worldPosition);

      group.rotation.set(
        satellite.rotation.x,
        satellite.rotation.y,
        satellite.rotation.z
      );

      group.scale.setScalar(satellite.scale);
      group.updateMatrixWorld(true);

      const worldBox = new THREE.Box3().setFromObject(group);

      if (worldBox.isEmpty()) return;

      const corners = [
        new THREE.Vector3(worldBox.min.x, worldBox.min.y, worldBox.min.z),
        new THREE.Vector3(worldBox.min.x, worldBox.min.y, worldBox.max.z),
        new THREE.Vector3(worldBox.min.x, worldBox.max.y, worldBox.min.z),
        new THREE.Vector3(worldBox.min.x, worldBox.max.y, worldBox.max.z),
        new THREE.Vector3(worldBox.max.x, worldBox.min.y, worldBox.min.z),
        new THREE.Vector3(worldBox.max.x, worldBox.min.y, worldBox.max.z),
        new THREE.Vector3(worldBox.max.x, worldBox.max.y, worldBox.min.z),
        new THREE.Vector3(worldBox.max.x, worldBox.max.y, worldBox.max.z),
      ];

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      let visiblePointCount = 0;

      corners.forEach((corner) => {
        const projected = corner.clone().project(camera);

        if (projected.z >= -1 && projected.z <= 1) {
          visiblePointCount++;

          const px =
            (projected.x + 1) * 0.5 * IMAGE_WIDTH;

          const py =
            (1 - projected.y) * 0.5 * IMAGE_HEIGHT;

          minX = Math.min(minX, px);
          minY = Math.min(minY, py);
          maxX = Math.max(maxX, px);
          maxY = Math.max(maxY, py);
        }
      });

      if (visiblePointCount === 0) return;

      minX = Math.max(
        0,
        Math.min(IMAGE_WIDTH, minX)
      );

      maxX = Math.max(
        0,
        Math.min(IMAGE_WIDTH, maxX)
      );

      minY = Math.max(
        0,
        Math.min(IMAGE_HEIGHT, minY)
      );

      maxY = Math.max(
        0,
        Math.min(IMAGE_HEIGHT, maxY)
      );

      const width = maxX - minX;
      const height = maxY - minY;

      if (width < 2 || height < 2) return;

      boxes.push({
        id: `SAT-${String(satellite.id).padStart(3, "0")}`,
        classId: 0,
        className: "satellite",
        x: minX,
        y: minY,
        width,
        height,
      });
    });

    onBoxesReady(boxes);
  });

  return (
    <>
      {satellites.map((satellite, index) => (
        <group
          key={`${sceneVersion}-${satellite.id}`}
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

function GeneratorScene({
  count,
  sceneVersion,
  onBoxesReady,
}) {
  const { camera } = useThree();

  const chaserPosition = {
    x: 4.8,
    y: 0,
    z: 0,
  };

  const transform = getSensorWorldTransform(
    chaserPosition,
    "RGB-D Camera"
  );

  camera.position.copy(transform.position);
  camera.quaternion.copy(transform.quaternion);
  camera.fov = transform.fov;
  camera.near = 0.1;
  camera.far = 300;
  camera.aspect =
    IMAGE_WIDTH / IMAGE_HEIGHT;

  camera.updateProjectionMatrix();

  return (
    <>
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={2}
      />

      <color
        attach="background"
        args={["#020712"]}
      />

      <SatelliteInstances
        count={count}
        sceneVersion={sceneVersion}
        onBoxesReady={onBoxesReady}
      />
    </>
  );
}

function DatasetGenerator() {
  const [satelliteCount, setSatelliteCount] =
    useState(3);

  const [boxes, setBoxes] = useState([]);

  const [captureCanvas, setCaptureCanvas] =
    useState(null);

  const [sampleNumber, setSampleNumber] =
    useState(1);

  const [sceneVersion, setSceneVersion] =
    useState(0);

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [generationProgress, setGenerationProgress] =
    useState(0);

  const handleBoxesReady = (newBoxes) => {
    setBoxes(newBoxes);
  };

  const waitForNextFrame = () => {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
  };

  const createSampleFiles = async (
    zip,
    number
  ) => {
    if (!captureCanvas || boxes.length === 0) {
      return false;
    }

    const sampleName =
      `satellite_${String(number).padStart(4, "0")}`;

    const imageData =
      captureCanvas.toDataURL("image/png");

    const response =
      await fetch(imageData);

    const imageBlob =
      await response.blob();

    const yoloLabels = boxes
      .map((box) => {
        const centerX =
          (box.x + box.width / 2) /
          IMAGE_WIDTH;

        const centerY =
          (box.y + box.height / 2) /
          IMAGE_HEIGHT;

        const width =
          box.width / IMAGE_WIDTH;

        const height =
          box.height / IMAGE_HEIGHT;

        return (
          `0 ${centerX.toFixed(6)} ` +
          `${centerY.toFixed(6)} ` +
          `${width.toFixed(6)} ` +
          `${height.toFixed(6)}`
        );
      })
      .join("\n");

    zip.file(
      `images/${sampleName}.png`,
      imageBlob
    );

    zip.file(
      `labels/${sampleName}.txt`,
      yoloLabels
    );

    return true;
  };

  const captureSample = async () => {
    if (!captureCanvas) {
      alert(
        "Dataset scene is not ready yet."
      );
      return;
    }

    if (boxes.length === 0) {
      alert(
        "No ground-truth bounding boxes available."
      );
      return;
    }

    const zip = new JSZip();

    await createSampleFiles(
      zip,
      sampleNumber
    );

    zip.file(
      "classes.txt",
      "satellite"
    );

    const zipBlob =
      await zip.generateAsync({
        type: "blob",
      });

    const url =
      URL.createObjectURL(zipBlob);

    const anchor =
      document.createElement("a");

    anchor.href = url;

    anchor.download =
      `satellite_${String(sampleNumber).padStart(4, "0")}.zip`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    setSampleNumber(
      (value) => value + 1
    );
  };

  const generateTwentySamples =
    async () => {
      if (!captureCanvas) {
        alert(
          "Dataset scene is not ready yet."
        );
        return;
      }

      setIsGenerating(true);
      setGenerationProgress(0);

      const zip = new JSZip();

      for (
        let i = 1;
        i <= TOTAL_SAMPLES;
        i++
      ) {
        /*
         * Generate a completely new
         * random satellite arrangement.
         */
        setBoxes([]);

        setSceneVersion(
          (value) => value + 1
        );

        await waitForNextFrame();

        /*
         * Wait until bounding boxes
         * are calculated for the new scene.
         */
        let attempts = 0;

        while (
          boxes.length === 0 &&
          attempts < 20
        ) {
          await waitForNextFrame();
          attempts++;
        }

        /*
         * React state updates are asynchronous.
         * Read the latest boxes from the DOM
         * state on the next rendering cycle.
         */
        const currentBoxes =
          await new Promise((resolve) => {
            requestAnimationFrame(() => {
              resolve(boxes);
            });
          });

        if (
          !captureCanvas ||
          currentBoxes.length === 0
        ) {
          console.warn(
            `Skipping sample ${i}: no boxes`
          );

          continue;
        }

        const sampleName =
          `satellite_${String(i).padStart(4, "0")}`;

        const imageData =
          captureCanvas.toDataURL(
            "image/png"
          );

        const response =
          await fetch(imageData);

        const imageBlob =
          await response.blob();

        const yoloLabels =
          currentBoxes
            .map((box) => {
              const centerX =
                (box.x + box.width / 2) /
                IMAGE_WIDTH;

              const centerY =
                (box.y + box.height / 2) /
                IMAGE_HEIGHT;

              const width =
                box.width / IMAGE_WIDTH;

              const height =
                box.height / IMAGE_HEIGHT;

              return (
                `0 ${centerX.toFixed(6)} ` +
                `${centerY.toFixed(6)} ` +
                `${width.toFixed(6)} ` +
                `${height.toFixed(6)}`
              );
            })
            .join("\n");

        zip.file(
          `images/${sampleName}.png`,
          imageBlob
        );

        zip.file(
          `labels/${sampleName}.txt`,
          yoloLabels
        );

        setGenerationProgress(i);
      }

      zip.file(
        "classes.txt",
        "satellite"
      );

      zip.file(
        "dataset.yaml",
        `path: .
train: images
val: images

names:
  0: satellite
`
      );

      const zipBlob =
        await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 6,
          },
        });

      const url =
        URL.createObjectURL(zipBlob);

      const anchor =
        document.createElement("a");

      anchor.href = url;

      anchor.download =
        "satellite_dataset_20_samples.zip";

      document.body.appendChild(anchor);

      anchor.click();

      anchor.remove();

      URL.revokeObjectURL(url);

      setSampleNumber(21);
      setIsGenerating(false);
    };

  return (
    <div className="dataset-generator-page">

      <div className="dataset-generator-header">
        <div>
          <h1>
            Satellite Dataset Generator
          </h1>

          <p>
            RGB-D camera POV ·
            Satellite-only synthetic dataset
          </p>
        </div>

        <div className="generator-status">
          <span>MODEL</span>
          <strong>
            satellite.glb
          </strong>
        </div>
      </div>

      <div className="dataset-generator-content">

        <div className="generator-viewer">

          <Canvas
            camera={{
              fov: 60,
              near: 0.1,
              far: 300,
            }}
            gl={{
              preserveDrawingBuffer: true,
              antialias: true,
            }}
            onCreated={({ gl }) => {
              setCaptureCanvas(
                gl.domElement
              );
            }}
            style={{
              width: `${IMAGE_WIDTH}px`,
              height: `${IMAGE_HEIGHT}px`,
            }}
          >
            <GeneratorScene
              count={satelliteCount}
              sceneVersion={sceneVersion}
              onBoxesReady={
                handleBoxesReady
              }
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
                <span className="ground-truth-label">
                  {box.id}
                </span>
              </div>
            ))}

          </div>

          <div className="generator-label">
            DATASET CAMERA · 640 × 480
          </div>

        </div>

        <div className="generator-controls">

          <h2>
            Dataset Generation
          </h2>

          <label>
            Number of satellites
          </label>

          <select
            value={satelliteCount}
            disabled={isGenerating}
            onChange={(event) => {
              setSatelliteCount(
                Number(event.target.value)
              );

              setBoxes([]);

              setSceneVersion(
                (value) => value + 1
              );
            }}
          >
            <option value={1}>
              1 Satellite
            </option>

            <option value={2}>
              2 Satellites
            </option>

            <option value={3}>
              3 Satellites
            </option>

            <option value={5}>
              5 Satellites
            </option>
          </select>

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
            onClick={generateTwentySamples}
            style={{
              marginTop: "10px",
            }}
          >
            {isGenerating
              ? `GENERATING ${generationProgress} / ${TOTAL_SAMPLES}`
              : "GENERATE 20 SAMPLES"}
          </button>

          <div className="box-results">

            <h3>
              Ground Truth
            </h3>

            {boxes.length === 0 ? (
              <p>
                Waiting for bounding boxes...
              </p>
            ) : (
              boxes.map((box) => (
                <div
                  className="box-row"
                  key={box.id}
                >
                  <strong>
                    {box.id}
                  </strong>

                  <span>
                    x:{box.x.toFixed(0)}
                    {" "}
                    y:{box.y.toFixed(0)}
                  </span>

                  <span>
                    w:{box.width.toFixed(0)}
                    {" "}
                    h:{box.height.toFixed(0)}
                  </span>
                </div>
              ))
            )}

          </div>

          <div className="generator-note">
            <strong>
              Class ID 0
            </strong>

            <span>
              satellite
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

useGLTF.preload(
  "/models/satellite.glb"
);

export default DatasetGenerator;