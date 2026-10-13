import "./DetectionControls.css";
import { FaPlay, FaSpinner } from "react-icons/fa";
import { useSensor } from "../../../context/SensorContext";

function DetectionControls() {
  const { capturedFrame, isDetecting, runDetection } = useSensor();

  return (
    <div className="detection-controls">
      <div className="control-group">
        <label>Confidence Threshold</label>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="80"
        />
        <span>80%</span>
      </div>

      <div className="control-group">
        <label>Detector Pipeline</label>
        <div style={{ color: "white", fontSize: "13px", padding: "8px 0", fontWeight: "500" }}>
          OpenCV Detector
        </div>
      </div>

      <div className="control-group">
        <label>Pipeline Status</label>
        <div className="status on">
          ● READY
        </div>
      </div>

      <div className="control-group action-group">
        <button
          className={`run-detection-btn ${isDetecting ? "running" : ""}`}
          onClick={runDetection}
          disabled={!capturedFrame || isDetecting}
          title={!capturedFrame ? "Capture a frame on Sensors page first" : "Run OpenCV target detection"}
        >
          {isDetecting ? (
            <>
              <FaSpinner className="spinner-icon" />
              <span>RUNNING...</span>
            </>
          ) : (
            <>
              <FaPlay className="btn-icon" />
              <span>RUN DETECTION</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default DetectionControls;