import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SimulationContext = createContext();

const CHASER_ORBIT_X = 4.8;
const CHASER_ORBIT_Z = 5.5;

const TARGET_ORBIT_X = 6.2;
const TARGET_ORBIT_Z = 7.0;

const INITIAL_CHASER_POSITION = {
  x: CHASER_ORBIT_X,
  y: 0,
  z: 0,
};

const INITIAL_TARGET_POSITION = {
  x: TARGET_ORBIT_X,
  y: 0,
  z: 0,
};

export function SimulationProvider({ children }) {
  const [selectedObject, setSelectedObject] = useState(null);

  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  const [missionTime, setMissionTime] = useState(0);

  const [resetKey, setResetKey] = useState(0);

  const [chaserPosition, setChaserPosition] = useState(
    INITIAL_CHASER_POSITION
  );

  const [targetPosition, setTargetPosition] = useState(
    INITIAL_TARGET_POSITION
  );

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

    const interval = setInterval(() => {
      const speed = simulationSpeed;

      /*
       * Mission time
       */
      setMissionTime((previousTime) => {
        return previousTime + 0.1 * speed;
      });

      /*
       * =========================
       * CHASER ORBIT
       * =========================
       */

      setChaserPosition((previousPosition) => {
        const currentAngle = Math.atan2(
          previousPosition.z / CHASER_ORBIT_Z,
          previousPosition.x / CHASER_ORBIT_X
        );

        const nextAngle =
          currentAngle + 0.003 * speed;

        return {
          x: Math.cos(nextAngle) * CHASER_ORBIT_X,
          y: 0,
          z: Math.sin(nextAngle) * CHASER_ORBIT_Z,
        };
      });

      /*
       * =========================
       * TARGET ORBIT
       * =========================
       */

      setTargetPosition((previousPosition) => {
        const currentAngle = Math.atan2(
          previousPosition.z / TARGET_ORBIT_Z,
          previousPosition.x / TARGET_ORBIT_X
        );

        const nextAngle =
          currentAngle + 0.0025 * speed;

        return {
          x: Math.cos(nextAngle) * TARGET_ORBIT_X,
          y: 0,
          z: Math.sin(nextAngle) * TARGET_ORBIT_Z,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed]);

  /*
   * =========================
   * RESET SIMULATION
   * =========================
   */

  const resetSimulation = () => {
    setIsRunning(false);

    setSimulationSpeed(1);

    setMissionTime(0);

    setChaserPosition({
      ...INITIAL_CHASER_POSITION,
    });

    setTargetPosition({
      ...INITIAL_TARGET_POSITION,
    });

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