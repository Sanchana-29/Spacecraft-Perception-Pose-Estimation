import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import * as THREE from "three";
import {
  CHASER_ORBIT_X,
  CHASER_ORBIT_Z,
  TARGET_ORBIT_X,
  TARGET_ORBIT_Z,
  INITIAL_CHASER_POSITION,
  INITIAL_TARGET_POSITION,
  getChaserPositionAtTime,
  getTargetPositionAtTime,
} from "../utils/trajectory";

const SimulationContext = createContext();

export function SimulationProvider({ children }) {
  const [selectedObject, setSelectedObject] = useState(null);
  const [trackingTarget, setTrackingTarget] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  const [missionTime, setMissionTime] = useState(0);
  const simTimeRef = useRef(0);

  const [resetKey, setResetKey] = useState(0);

  const [chaserPosition, setChaserPosition] = useState(
    INITIAL_CHASER_POSITION
  );

  const [targetPosition, setTargetPosition] = useState(
    INITIAL_TARGET_POSITION
  );

  const INITIAL_TARGET_QUATERNION = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0, Math.PI / 2, 0)
  );

  const [targetQuaternion, setTargetQuaternion] = useState(
    INITIAL_TARGET_QUATERNION.clone()
  );

  const [angularVelocity, setAngularVelocity] = useState({ x: 0, y: 0, z: 0 });
  const [tumblingRate, setTumblingRate] = useState(0);

  /*
   * =========================
   * SINGLE SIMULATION LOOP
   * =========================
   *
   * Context is now responsible for:
   * - Mission time
   * - Chaser movement
   * - Target movement
   *
   * Spacecraft components will
   * only follow these positions.
   */

  useEffect(() => {
    if (!isRunning) return;

    let animId;
    let lastTime = performance.now();

    const tick = (now) => {
      const deltaSec = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      simTimeRef.current += deltaSec * simulationSpeed;
      const t = simTimeRef.current;

      /*
       * Mission time
       */
      setMissionTime(t);

      /*
       * =========================
       * CHASER CIRCULAR ORBIT
       * =========================
       */
      const nextChaserVec = getChaserPositionAtTime(t);
      setChaserPosition({
        x: nextChaserVec.x,
        y: nextChaserVec.y,
        z: nextChaserVec.z,
      });

      /*
       * =========================
       * TARGET CW RELATIVE ORBIT
       * =========================
       */
      const nextTargetVec = getTargetPositionAtTime(t);
      setTargetPosition({
        x: nextTargetVec.x,
        y: nextTargetVec.y,
        z: nextTargetVec.z,
      });

      /*
       * =========================
       * TARGET ROTATION
       * =========================
       */
      const simDt = deltaSec * simulationSpeed;
      if (simDt > 0) {
        setTargetQuaternion((currentQuat) => {
          // Base realistic tumbling rates (rad/s)
          const baseTumble = { x: 0.05, y: -0.03, z: 0.02 };
          
          // Calculate quaternion change over this timestep
          const deltaQuat = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
              baseTumble.x * simDt,
              baseTumble.y * simDt,
              baseTumble.z * simDt,
              "XYZ"
            )
          );
          
          // Apply change (local rotation)
          const nextQuat = currentQuat.clone().multiply(deltaQuat);
          
          // Calculate angular velocity from actual orientation change
          const diffQuat = nextQuat.clone().multiply(currentQuat.clone().invert());
          
          // Ensure shortest path
          if (diffQuat.w < 0) {
            diffQuat.x = -diffQuat.x;
            diffQuat.y = -diffQuat.y;
            diffQuat.z = -diffQuat.z;
            diffQuat.w = -diffQuat.w;
          }

          const angle = 2 * Math.acos(Math.max(-1, Math.min(1, diffQuat.w)));
          
          let wX = 0, wY = 0, wZ = 0;
          if (angle > 0.0001) {
            const sin = Math.sqrt(1 - diffQuat.w * diffQuat.w);
            if (sin > 0.0001) {
              wX = (diffQuat.x / sin) * (angle / simDt);
              wY = (diffQuat.y / sin) * (angle / simDt);
              wZ = (diffQuat.z / sin) * (angle / simDt);
            }
          }

          setAngularVelocity({ x: wX, y: wY, z: wZ });
          setTumblingRate(Math.sqrt(wX * wX + wY * wY + wZ * wZ));

          return nextQuat;
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [isRunning, simulationSpeed]);

  /*
   * =========================
   * RESET SIMULATION
   * =========================
   */

  const resetSimulation = () => {
    setIsRunning(false);

    setSimulationSpeed(1);

    simTimeRef.current = 0;
    setMissionTime(0);

    setChaserPosition({
      ...INITIAL_CHASER_POSITION,
    });

    setTargetPosition({
      ...INITIAL_TARGET_POSITION,
    });

    setTargetQuaternion(INITIAL_TARGET_QUATERNION.clone());
    setAngularVelocity({ x: 0, y: 0, z: 0 });
    setTumblingRate(0);

    setSelectedObject(null);

    setResetKey((previousKey) => previousKey + 1);
  };

  return (
    <SimulationContext.Provider
      value={{
        /*
         * Selection
         */
        selectedObject,
        setSelectedObject,
        trackingTarget,
        setTrackingTarget,
        isTracking,
        setIsTracking,

        /*
         * Simulation controls
         */
        isRunning,
        setIsRunning,

        simulationSpeed,
        setSimulationSpeed,

        missionTime,
        setMissionTime,

        /*
         * Reset
         */
        resetKey,
        resetSimulation,

        /*
         * Spacecraft positions
         */
        chaserPosition,
        setChaserPosition,

        targetPosition,
        setTargetPosition,

        targetQuaternion,
        setTargetQuaternion,

        angularVelocity,
        tumblingRate,

        /*
         * Orbit constants
         */
        CHASER_ORBIT_X,
        CHASER_ORBIT_Z,
        TARGET_ORBIT_X,
        TARGET_ORBIT_Z,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  return useContext(SimulationContext);
}