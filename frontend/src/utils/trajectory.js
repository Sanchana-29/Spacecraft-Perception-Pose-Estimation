import * as THREE from "three";

export const ORBIT_RADIUS = 5.2;
export const ORBIT_OMEGA = 0.03;

export const CHASER_ORBIT_X = ORBIT_RADIUS;
export const CHASER_ORBIT_Z = ORBIT_RADIUS;
export const TARGET_ORBIT_X = ORBIT_RADIUS;
export const TARGET_ORBIT_Z = ORBIT_RADIUS;

export const INITIAL_CHASER_POSITION = {
  x: ORBIT_RADIUS,
  y: 0,
  z: 0,
};

export const INITIAL_TARGET_POSITION = {
  x: ORBIT_RADIUS,
  y: 0,
  z: 1.24,
};

/**
 * Calculates exact Chaser position vector in Earth-centered world coordinates at simulation time t.
 */
export function getChaserPositionAtTime(t) {
  const chaserAngle = ORBIT_OMEGA * t;
  return new THREE.Vector3(
    Math.cos(chaserAngle) * ORBIT_RADIUS,
    0,
    Math.sin(chaserAngle) * ORBIT_RADIUS
  );
}

/**
 * Calculates exact Target position vector in Earth-centered world coordinates at simulation time t.
 * Uses Clohessy-Wiltshire (CW) relative orbital dynamics relative to Chaser position,
 * with local heading orientation aligned to the instantaneous Chaser velocity vector.
 */
export function getTargetPositionAtTime(t) {
  const chaserAngle = ORBIT_OMEGA * t;
  const nextChaserPos = getChaserPositionAtTime(t);

  // Orientation heading angle that aligns local -Z (forward/camera) with instantaneous velocity vector
  const chaserRotationY = chaserAngle + Math.PI;

  // CW relative motion offsets at orbital frequency (0.03 rad/s)
  const Ax = 0.08;
  const d0 = -1.4;
  const Az = 0.04;

  const xLocal = Ax * Math.sin(ORBIT_OMEGA * t);
  const yLocal = Az * Math.sin(ORBIT_OMEGA * t);
  const zLocal = d0 + 2 * Ax * Math.cos(ORBIT_OMEGA * t);

  const localOffset = new THREE.Vector3(xLocal, yLocal, zLocal);
  const chaserQuat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    chaserRotationY
  );

  localOffset.applyQuaternion(chaserQuat);
  return nextChaserPos.add(localOffset);
}
