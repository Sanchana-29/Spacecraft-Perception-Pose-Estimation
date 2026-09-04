import { useMemo } from "react";
import * as THREE from "three";

function OrbitPath({
  radiusX = 5,
  radiusZ = 5,
  y = 0,
}) {
  const points = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      0,
      0,
      radiusX,
      radiusZ,
      0,
      Math.PI * 2,
      false,
      0
    );

    return curve
      .getPoints(160)
      .map(
        (point) =>
          new THREE.Vector3(
            point.x,
            y,
            point.y
          )
      );
  }, [radiusX, radiusZ, y]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        transparent
        opacity={0.45}
      />
    </line>
  );
}

export default OrbitPath;