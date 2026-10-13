import * as THREE from "three";
import {
  CHASER_ORBIT_X,
  CHASER_ORBIT_Z,
  TARGET_ORBIT_X,
  TARGET_ORBIT_Z,
} from "../../../utils/trajectory";

export { CHASER_ORBIT_X, CHASER_ORBIT_Z, TARGET_ORBIT_X, TARGET_ORBIT_Z };
export const CHASER_SCALE = 0.25;

export const SENSOR_CONFIGS = {
  "RGB-D Camera": {
    key: "rgbd",
    localPos: [0, 0.48, -0.70],
    localRot: [0, 0, 0],
    fov: 60,
    subtitle: "RGB + Depth Perception Feed",
  },
  "Stereo Camera": {
    key: "stereo",
    localPos: [0, 0.35, -0.58], // center reference
    localRot: [0, 0, 0],
    fov: 60,
    subtitle: "Binocular Vision Feed",
  },
  "Stereo Left": {
    key: "stereo_left",
    localPos: [-0.28, 0.35, -0.58],
    localRot: [0, 0, 0],
    fov: 60,
    subtitle: "Left Camera Optical Feed",
  },
  "Stereo Right": {
    key: "stereo_right",
    localPos: [0.28, 0.35, -0.58],
    localRot: [0, 0, 0],
    fov: 60,
    subtitle: "Right Camera Optical Feed",
  },
  "Thermal Camera": {
    key: "thermal",
    localPos: [0, 0.05, 0.90],
    localRot: [0.38, 0, 0], // Rear-mounted, fixed tilt (+21.8° pitch UP in local frame)
    fov: 30, // Narrow telephoto thermal FOV (half-angle 15°)
    subtitle: "Infrared Thermal Feed",
  },
  LiDAR: {
    key: "lidar",
    localPos: [0, 0, -1.15],
    localRot: [0, 0, 0],
    fov: 60,
    subtitle: "3D Point Cloud Feed",
  },
};

/**
 * Calculates physical world position & quaternion of a sensor mount on Chaser
 */
export function getSensorWorldTransform(chaserPosition, sensorName, subType = null) {
  const configKey = subType || sensorName;
  const config = SENSOR_CONFIGS[configKey] || SENSOR_CONFIGS["RGB-D Camera"];

  const chaserPos = new THREE.Vector3(
    chaserPosition?.x ?? CHASER_ORBIT_X,
    chaserPosition?.y ?? 0,
    chaserPosition?.z ?? 0
  );

  const angle = Math.atan2(
    chaserPos.z / CHASER_ORBIT_Z,
    chaserPos.x / CHASER_ORBIT_X
  );
  const chaserRotationY = angle + Math.PI;

  const chaserQuat = new THREE.Quaternion();
  chaserQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), chaserRotationY);

  // Apply Chaser scale (0.25) to physical sensor offset
  const localOffsetScaled = new THREE.Vector3(
    config.localPos[0] * CHASER_SCALE,
    config.localPos[1] * CHASER_SCALE,
    config.localPos[2] * CHASER_SCALE
  );
  localOffsetScaled.applyQuaternion(chaserQuat);

  const sensorWorldPos = chaserPos.clone().add(localOffsetScaled);

  // Sensor orientation = Chaser orientation * Sensor local orientation
  const sensorLocalQuat = new THREE.Quaternion();
  const euler = new THREE.Euler(
    config.localRot[0],
    config.localRot[1],
    config.localRot[2],
    "YXZ"
  );
  sensorLocalQuat.setFromEuler(euler);

  const sensorWorldQuat = chaserQuat.clone().multiply(sensorLocalQuat);

  return {
    position: sensorWorldPos,
    quaternion: sensorWorldQuat,
    fov: config.fov,
  };
}

/**
 * Calculates physical Euclidean distance between physical sensor camera & target satellite
 */
export function getSensorToTargetDistance(chaserPosition, targetPosition, sensorName, subType = null) {
  const { position: sensorPos } = getSensorWorldTransform(chaserPosition, sensorName, subType);

  const targetPos = new THREE.Vector3(
    targetPosition?.x ?? TARGET_ORBIT_X,
    targetPosition?.y ?? 0,
    targetPosition?.z ?? 0
  );

  return sensorPos.distanceTo(targetPos);
}
