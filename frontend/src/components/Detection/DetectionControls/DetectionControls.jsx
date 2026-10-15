import "./DetectionControls.css";
import { FaPlay, FaSpinner } from "react-icons/fa";
import { useSensor } from "../../../context/SensorContext";

function DetectionControls() {
  const {
    capturedFrame,
    isDetecting,
    runDetection,
    confidenceThreshold,
    setConfidenceThreshold,
  } = useSensor();

  const percentage = Math.round(confidenceThreshold * 100);

  return (
    <div className="detection-controls">
      <div className="control-group">
        <label>Confidence Threshold</label>
        <input
          type="range"
          min="1"
          max="100"
          value={percentage}
          onChange={(e) => setConfidenceThreshold(Number(e.target.value) / 100)}
        />
        <span>{percentage}%</span>
      </div>

      <div className="control-group">
        <label>Detector Pipeline</label>
        <div style={{ color: "white", fontSize: "13px", padding: "8px 0", fontWeight: "500" }}>
         YOLOv8n Satellite Detector
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
          onClick={() => runDetection(confidenceThreshold)}
          disabled={!capturedFrame || isDetecting}
          title={!capturedFrame ? "Capture a frame on Sensors page first" : "Run YOLOv8n satellite detection"}
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