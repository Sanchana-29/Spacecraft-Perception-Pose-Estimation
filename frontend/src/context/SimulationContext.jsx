import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SimulationContext = createContext();

export function SimulationProvider({ children }) {

  // ==========================================
  // SELECTED OBJECT
  // ==========================================

  const [selectedObject, setSelectedObject] =
    useState(null);


  // ==========================================
  // SIMULATION
  // ==========================================

  const [isRunning, setIsRunning] =
    useState(false);

  const [simulationSpeed, setSimulationSpeed] =
    useState(1);


  // ==========================================
  // MISSION TIME
  // ==========================================

  const [missionTime, setMissionTime] =
    useState(0);


  // ==========================================
  // RESET
  // ==========================================

  const [resetKey, setResetKey] =
    useState(0);


  // ==========================================
  // CHASER POSITION
  // ==========================================

  const [chaserPosition, setChaserPosition] =
    useState({
      x: 4.8,
      y: 0,
      z: 0,
    });


  // ==========================================
  // TARGET POSITION
  // ==========================================

  const [targetPosition, setTargetPosition] =
    useState({
      x: 6.2,
      y: 0,
      z: 0,
    });


  // ==========================================
  // CENTRAL SIMULATION UPDATE
  // ==========================================

  useEffect(() => {

    if (!isRunning) return;


    const interval = setInterval(() => {

      setMissionTime((prev) =>
        prev + 0.1 * simulationSpeed
      );


      // ========================================
      // CHASER ORBIT
      // ========================================

      setChaserPosition((prev) => {

        const currentAngle =
          Math.atan2(
            prev.z / 5.5,
            prev.x / 4.8
          );


        const nextAngle =
          currentAngle +
          0.003 * simulationSpeed;


        return {
          x:
            Math.cos(nextAngle) * 4.8,

          y: 0,

          z:
            Math.sin(nextAngle) * 5.5,
        };

      });


      // ========================================
      // TARGET ORBIT
      // ========================================

      setTargetPosition((prev) => {

        const currentAngle =
          Math.atan2(
            prev.z / 7.0,
            prev.x / 6.2
          );


        const nextAngle =
          currentAngle +
          0.0025 * simulationSpeed;


        return {
          x:
            Math.cos(nextAngle) * 6.2,

          y: 0,

          z:
            Math.sin(nextAngle) * 7.0,
        };

      });

    }, 100);


    return () => {
      clearInterval(interval);
    };

  }, [
    isRunning,
    simulationSpeed,
  ]);


  // ==========================================
  // RESET
  // ==========================================

  const resetSimulation = () => {

    setIsRunning(false);

    setSimulationSpeed(1);

    setMissionTime(0);


    setChaserPosition({
      x: 4.8,
      y: 0,
      z: 0,
    });


    setTargetPosition({
      x: 6.2,
      y: 0,
      z: 0,
    });


    setResetKey(
      (prev) => prev + 1
    );


    setSelectedObject(null);
  };


  // ==========================================
  // PROVIDER
  // ==========================================

  return (

    <SimulationContext.Provider
      value={{

        selectedObject,
        setSelectedObject,

        isRunning,
        setIsRunning,

        simulationSpeed,
        setSimulationSpeed,

        missionTime,
        setMissionTime,

        resetKey,
        resetSimulation,

        chaserPosition,
        setChaserPosition,

        targetPosition,
        setTargetPosition,

      }}
    >

      {children}

    </SimulationContext.Provider>
  );
}


// ==========================================
// HOOK
// ==========================================

export function useSimulation() {

  return useContext(
    SimulationContext
  );

}