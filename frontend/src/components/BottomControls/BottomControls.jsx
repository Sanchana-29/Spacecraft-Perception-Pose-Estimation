import "./BottomControls.css";

import {
  FaPlay,
  FaPause,
  FaRedoAlt,
} from "react-icons/fa";

import { useEffect } from "react";
import { useSimulation } from "../../context/SimulationContext";

function BottomControls() {

  const {
    isRunning,
    setIsRunning,
    simulationSpeed,
    setSimulationSpeed,
    missionTime,
    setMissionTime,
    resetSimulation,
  } = useSimulation();


  // ==============================
  // MISSION TIMER
  // ==============================

  useEffect(() => {

    if (!isRunning) return;

    const timer = setInterval(() => {

      setMissionTime((prev) =>
        prev + 0.1 * simulationSpeed
      );

    }, 100);

    return () => clearInterval(timer);

  }, [
    isRunning,
    simulationSpeed,
    setMissionTime,
  ]);


  // ==============================
  // FORMAT TIME
  // ==============================

  const formatMissionTime = (seconds) => {

    const totalSeconds = Math.floor(seconds);

    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const secs =
      totalSeconds % 60;

    return (
      `${String(hours).padStart(2, "0")}:` +
      `${String(minutes).padStart(2, "0")}:` +
      `${String(secs).padStart(2, "0")}`
    );
  };


  // ==============================
  // UI
  // ==============================

  return (
    <div className="bottom-controls">

      {/* PLAY / PAUSE / RESET */}

      <div className="control-buttons">

        <button
          onClick={() => setIsRunning(true)}
        >
          <FaPlay />
          Play
        </button>


        <button
          onClick={() => setIsRunning(false)}
        >
          <FaPause />
          Pause
        </button>


        <button
          onClick={resetSimulation}
        >
          <FaRedoAlt />
          Reset
        </button>

      </div>


      {/* SIMULATION SPEED */}

      <div className="simulation-speed">

        <label>
          Simulation Speed
        </label>

        <input
          type="range"
          min="0.5"
          max="5"
          step="0.5"
          value={simulationSpeed}
          onChange={(e) =>
            setSimulationSpeed(
              Number(e.target.value)
            )
          }
        />

        <span>
          {simulationSpeed}x
        </span>

      </div>


      {/* MISSION TIME */}

      <div className="mission-time">

        <label>
          Mission Time
        </label>

        <span>
          {formatMissionTime(missionTime)}
        </span>

      </div>

    </div>
  );
}

export default BottomControls;