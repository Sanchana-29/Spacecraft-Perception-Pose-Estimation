import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import { useSimulation } from "../../../context/SimulationContext";
import {
  getSensorWorldTransform,
  TARGET_ORBIT_X,
  TARGET_ORBIT_Z,
} from "./sensorConstants";
import { INITIAL_TARGET_POSITION } from "../../../utils/trajectory";

import Earth from "../../Scene/Earth";
import StarsField from "../../Scene/StarsField";
import SunLight from "../../Scene/SunLight";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

const THERMAL_COLORS = [
  { stop: 0.0, color: new THREE.Color("#1e1b4b") },
  { stop: 0.2, color: new THREE.Color("#0284c7") },
  { stop: 0.4, color: new THREE.Color("#16a34a") },
  { stop: 0.6, color: new THREE.Color("#facc15") },
  { stop: 0.8, color: new THREE.Color("#ea580c") },
  { stop: 0.95, color: new THREE.Color("#dc2626") },
  { stop: 1.0, color: new THREE.Color("#ffffff") },
];

function getThermalColor(t) {
  t = Math.max(0, Math.min(1, t));

  for (let i = 0; i < THERMAL_COLORS.length - 1; i++) {
    if (
      t >= THERMAL_COLORS[i].stop &&
      t <= THERMAL_COLORS[i + 1].stop
    ) {
      const range =
        THERMAL_COLORS[i + 1].stop -
        THERMAL_COLORS[i].stop;

      const factor =
        (t - THERMAL_COLORS[i].stop) / range;

      return THERMAL_COLORS[i].color
        .clone()
        .lerp(
          THERMAL_COLORS[i + 1].color,
          factor
        );
    }
  }

  return THERMAL_COLORS[
    THERMAL_COLORS.length - 1
  ].color.clone();
}

/*
 * Target Satellite
 *
 * RGB-D / Stereo -> normal spacecraft
 * Thermal         -> simulated infrared false-colour
 * LiDAR           -> combined spacecraft point cloud
 */
const processedSceneCache = new Map();


function getCachedProcessedScene_dummy() {}

function getCachedProcessedScene(scene, sensorMode) {
  const cacheKey = sensorMode === "Stereo Camera" ? "RGB-D Camera" : sensorMode;
  
  if (processedSceneCache.has(cacheKey)) {
    return processedSceneCache.get(cacheKey).clone(true);
  }

  const cloned = scene.clone(true);

  /*
   * =========================================================
   * LI-DAR MODE
   * =========================================================
   */
  if (sensorMode === "LiDAR") {
      cloned.updateMatrixWorld(true);

      const meshes = [];
      let totalSurfaceArea = 0;

      /*
       * Collect every mesh from the complete
       * spacecraft hierarchy.
       */
      cloned.traverse((child) => {
        if (!child.isMesh || !child.geometry) {
          return;
        }

        let sampler;

        try {
          sampler =
            new MeshSurfaceSampler(child).build();
        } catch (error) {
          console.warn(
            "LiDAR sampler failed:",
            child.name
          );
          return;
        }

        let area = 1;

        if (
          sampler.distribution &&
          sampler.distribution.length > 0
        ) {
          area =
            sampler.distribution[
              sampler.distribution.length - 1
            ];
        }

        meshes.push({
          child,
          sampler,
          area,
        });

        totalSurfaceArea += area;
      });

      /*
       * Total point budget.
       *
       * Enough points to preserve the spacecraft
       * structure while remaining suitable for GTX 1650.
       */
      const TOTAL_POINTS = 20000;

      /*
       * Deterministic pseudo-random generator.
       * This prevents the point cloud from jumping
       * every time the component is recreated.
       */
      let seed = 48391;

      const seededRandom = () => {
        const x =
          Math.sin(seed++) * 43758.5453123;

        return x - Math.floor(x);
      };

      const allPositions = [];

      /*
       * We use BOTH:
       *
       * 1. Surface samples
       * 2. Original mesh vertices
       *
       * Surface samples provide density.
       * Original vertices preserve spacecraft edges
       * and thin structural details.
       */

      meshes.forEach(
        ({ child, sampler, area }) => {
          if (totalSurfaceArea <= 0) {
            return;
          }

          /*
           * Allocate points according to surface area.
           */
          const meshPointCount = Math.max(
            20,
            Math.floor(
              (area / totalSurfaceArea) *
                TOTAL_POINTS
            )
          );

          /*
           * Stable random sampling.
           */
          sampler.randomFunction =
            seededRandom;

          const tempPosition =
            new THREE.Vector3();

          /*
           * About 75% surface samples.
           */
          const surfacePointCount =
            Math.floor(
              meshPointCount * 0.75
            );

          for (
            let i = 0;
            i < surfacePointCount;
            i++
          ) {
            sampler.sample(tempPosition);

            /*
             * Convert local mesh coordinates
             * into the common spacecraft coordinate system.
             */
            const worldPoint =
              tempPosition
                .clone()
                .applyMatrix4(
                  child.matrixWorld
                );

            allPositions.push(
              worldPoint.x,
              worldPoint.y,
              worldPoint.z
            );
          }

          /*
           * About 25% original geometry vertices.
           * This helps preserve edges and thin structures.
           */
          const positionAttribute =
            child.geometry.getAttribute(
              "position"
            );

          if (!positionAttribute) {
            return;
          }

          const vertexPointCount = Math.floor(
            meshPointCount * 0.25
          );

          const vertexCount =
            positionAttribute.count;

          for (
            let i = 0;
            i < vertexPointCount;
            i++
          ) {
            /*
             * Deterministic selection of vertices.
             */
            const index =
              Math.floor(
                seededRandom() *
                  vertexCount
              );

            tempPosition.set(
              positionAttribute.getX(index),
              positionAttribute.getY(index),
              positionAttribute.getZ(index)
            );

            const worldPoint =
              tempPosition
                .clone()
                .applyMatrix4(
                  child.matrixWorld
                );

            allPositions.push(
              worldPoint.x,
              worldPoint.y,
              worldPoint.z
            );
          }
        }
      );

      /*
       * ONE combined geometry for the COMPLETE
       * spacecraft.
       */
      const combinedGeometry =
        new THREE.BufferGeometry();

      combinedGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          allPositions,
          3
        )
      );

      combinedGeometry.computeBoundingSphere();

      /*
       * Fine individual LiDAR returns.
       *
       * Slightly larger than 0.008 so the cloud
       * remains visible at the physical sensor range,
       * but small enough to avoid solid chunks.
       */
      const pointMaterial =
        new THREE.PointsMaterial({
          color: new THREE.Color("#35d9ff"),
          size: 0.012,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.72,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

      const combinedPoints =
        new THREE.Points(
          combinedGeometry,
          pointMaterial
        );

      /*
       * Single point cloud.
       */
      const pointsGroup =
        new THREE.Group();

      pointsGroup.add(
        combinedPoints
      );

      processedSceneCache.set(cacheKey, pointsGroup);
      return pointsGroup.clone(true);
    }

    /*
     * =========================================================
     * THERMAL MODE
     * =========================================================
     */

    cloned.traverse((child) => {
      if (!child.isMesh) {
        return;
      }

      if (sensorMode === "Thermal Camera") {
        const nameLower = (child.name || "").toLowerCase();
        let tempValue = 0.5;

        if (
          nameLower.includes("engine") ||
          nameLower.includes("thruster") ||
          nameLower.includes("nozzle")
        ) {
          tempValue = 0.95;
        } else if (
          nameLower.includes("core") ||
          nameLower.includes("bus") ||
          nameLower.includes("payload")
        ) {
          tempValue = 0.75;
        } else if (
          nameLower.includes("body") ||
          nameLower.includes("main") ||
          nameLower.includes("hull")
        ) {
          tempValue = 0.60;
        } else if (
          nameLower.includes("solar") ||
          nameLower.includes("panel") ||
          nameLower.includes("array") ||
          nameLower.includes("wing")
        ) {
          tempValue = 0.20;
        } else if (
          nameLower.includes("radiator") ||
          nameLower.includes("dish") ||
          nameLower.includes("antenna")
        ) {
          tempValue = 0.10;
        } else {
          /*
           * Fallback: evaluate geometric position relative to spacecraft center
           * to assign realistic false-colour thermal variation across generic meshes.
           */
          if (child.geometry) {
            if (!child.geometry.boundingBox) {
              child.geometry.computeBoundingBox();
            }
            const bbox = child.geometry.boundingBox;
            const center = new THREE.Vector3();
            if (bbox) bbox.getCenter(center);

            const absX = Math.abs(center.x);
            if (absX > 1.0) {
              tempValue = 0.18; // Radiatively cooled solar arrays (cyan/blue)
            } else if (center.z > 0.6 || center.y < -0.4) {
              tempValue = 0.90; // Hot thrusters/nozzles (bright red/white)
            } else if (absX < 0.4 && Math.abs(center.y) < 0.4) {
              tempValue = 0.70; // Active electronics core (yellow/orange)
            } else {
              tempValue = 0.45; // Structural body panels (green/yellow)
            }
          }
        }
        const thermalColor = getThermalColor(tempValue);

        child.material = new THREE.MeshStandardMaterial({
          color: thermalColor,
          emissive: thermalColor,
          emissiveIntensity: 0.6,
          roughness: 0.4,
          metalness: 0.1,
        });
      }
      /*
       * RGB-D / Stereo naturally inherit the original shared materials 
       * from the GLTF clone hierarchy, avoiding redundant shader compilations.
       */
    });

    processedSceneCache.set(cacheKey, cloned);
    return cloned.clone(true);
}

function SensorTargetSatellite({ sensorMode }) {
  const {
    targetPosition,
    targetQuaternion,
  } = useSimulation();

  const { scene } = useGLTF(
    "/models/satellite.glb"
  );

  const groupRef = useRef();

  const clonedScene = useMemo(() => {
    return getCachedProcessedScene(scene, sensorMode);
  }, [scene, sensorMode]);

  /*
   * =========================================================
   * TARGET MOVEMENT + ATTITUDE
   * =========================================================
   */

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    const tx =
      targetPosition?.x ??
      INITIAL_TARGET_POSITION.x;

    const ty =
      targetPosition?.y ?? 0;

    const tz =
      targetPosition?.z ?? 0;

    groupRef.current.position.set(
      tx,
      ty,
      tz
    );

    /*
     * Use the independent target attitude
     * generated by SimulationContext.
     */
    if (targetQuaternion) {
      groupRef.current.quaternion.copy(
        targetQuaternion
      );
    } else {
      /*
       * Fallback to existing orbital orientation.
       */
      const angle =
        Math.atan2(
          tz / TARGET_ORBIT_Z,
          tx / TARGET_ORBIT_X
        );

      groupRef.current.rotation.set(
        0,
        angle + Math.PI / 2,
        0
      );
    }
  });

  return (
    <group
      ref={groupRef}
      scale={0.08}
    >
      <primitive
        object={clonedScene}
      />
    </group>
  );
}

/*
 * =========================================================
 * PHYSICAL SENSOR CAMERA
 * =========================================================
 */

function PhysicalSensorCameraController({
  sensor,
  subType,
  onGlReady,
}) {
  const {
    camera,
    gl,
    scene,
  } = useThree();

  const {
    chaserPosition,
    targetPosition,
    isTracking,
    trackingTarget,
  } = useSimulation();

  useEffect(() => {
    if (onGlReady) {
      onGlReady({
        gl,
        scene,
        camera,
      });
    }
  }, [
    gl,
    scene,
    camera,
    onGlReady,
  ]);

  const lightRef = useRef();

  useFrame(() => {
    const {
      position,
      quaternion,
      fov,
    } =
      getSensorWorldTransform(
        chaserPosition,
        sensor,
        subType
      );

    camera.position.copy(
      position
    );

    // If tracking is active, override physical mounting orientation with a gimbal/boresight track
    if (isTracking && trackingTarget) {
      // In a real multi-target scenario, we'd look up the trackingTarget's position.
      // Since this is a single target simulation architecture right now, we use targetPosition.
      // Three.js cameras look along their local -Z axis naturally.
      camera.lookAt(targetPosition.x, targetPosition.y, targetPosition.z);
    } else {
      camera.quaternion.copy(
        quaternion
      );
    }

    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    
    if (lightRef.current) {
      lightRef.current.position.copy(camera.position);
    }
  });

  return (
    <pointLight ref={lightRef} intensity={2.5} distance={25} />
  );
}

/*
 * =========================================================
 * COMPLETE SENSOR WORLD
 * =========================================================
 */

export default function SensorSceneWorld({
  sensor,
  subType = null,
  onGlReady = null,
  isMini = false,
}) {
  const isLiDAR =
    sensor === "LiDAR";

  return (
    <>
      <PhysicalSensorCameraController
        sensor={sensor}
        subType={subType}
        onGlReady={onGlReady}
      />

      <>
        <SunLight />
        {/* Ambient light prevents pitch black shadows */}
        <ambientLight intensity={0.8} />
      </>
      {/*
       * IMPORTANT:
       * Earth and Stars are visual background.
       * They remain visible even in LiDAR mode.
       */}
      <StarsField />
      <Earth isMini={isMini} />

      {/* Target spacecraft */}
      <SensorTargetSatellite
        sensorMode={sensor}
      />
    </>
  );
}

useGLTF.preload(
  "/models/satellite.glb"
);