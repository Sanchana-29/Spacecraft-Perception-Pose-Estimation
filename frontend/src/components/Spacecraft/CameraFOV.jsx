import { useMemo } from "react";
import * as THREE from "three";

function CameraFOV({
  fov = 60,
  distance = 4,
  color = "cyan",
}) {

  const geometry = useMemo(() => {

    const halfAngle =
      THREE.MathUtils.degToRad(fov / 2);

    const width =
      Math.tan(halfAngle) * distance;

    const points = [

      // Camera point
      new THREE.Vector3(0, 0, 0),

      // Top-left
      new THREE.Vector3(
        -width,
        width,
        -distance
      ),

      // Top-right
      new THREE.Vector3(
        width,
        width,
        -distance
      ),

      // Bottom-right
      new THREE.Vector3(
        width,
        -width,
        -distance
      ),

      // Bottom-left
      new THREE.Vector3(
        -width,
        -width,
        -distance
      ),

      // Back to top-left
      new THREE.Vector3(
        -width,
        width,
        -distance
      ),

    ];

    return new THREE.BufferGeometry()
      .setFromPoints(points);

  }, [fov, distance]);


  return (

    <line geometry={geometry}>

      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.35}
      />

    </line>

  );
}

export default CameraFOV;