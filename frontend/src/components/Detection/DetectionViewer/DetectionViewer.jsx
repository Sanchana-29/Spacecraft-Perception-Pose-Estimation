import { useNavigate } from "react-router-dom";
import { FaCamera, FaSatellite, FaRedo } from "react-icons/fa";
import { useSensor } from "../../../context/SensorContext";
import "./DetectionViewer.css";

function DetectionViewer() {
  const { capturedFrame } = useSensor();
  const navigate = useNavigate();

  return (
    <div className="detection-viewer">
      <div className="viewer-header">
        <div>
          <h3>Detection Viewer</h3>
          <span>
            {capturedFrame
              ? `${capturedFrame.selectedSensor} Captured Input`
              : "Sensor Input Feed"}
          </span>
        </div>

        <div className="viewer-header-right">
          {capturedFrame && (
            <button
              className="recapture-btn"
              onClick={() => navigate("/sensors")}
              title="Capture a new frame from Sensors"
            >
              <FaRedo className="btn-icon" />
              <span>New Capture</span>
            </button>
          )}

          <div className="viewer-status">
            {capturedFrame ? "🟢 FRAME LOADED" : "🟡 AWAITING INPUT"}
          </div>
        </div>
      </div>

      <div className="viewer-body">
        {capturedFrame ? (
          <div className="captured-frame-container">
            <img
              src={capturedFrame.imageData}
              alt="Captured Sensor Frame"
              className="captured-frame-image"
            />

            {/* HUD OVERLAYS */}
            <div className="frame-overlay-badge top-left">
              <span className="badge-title">SENSOR / FOV</span>
              <span className="badge-value">
                {capturedFrame.selectedSensor} ({capturedFrame.fov || 60}°)
              </span>
              <span className="badge-subtitle">
                CHASER: [{capturedFrame.chaserPosition?.x}, {capturedFrame.chaserPosition?.z}]
              </span>
            </div>

            <div className="frame-overlay-badge top-right">
              <span className="badge-title">MISSION TIME</span>
              <span className="badge-value">T+{capturedFrame.missionTime}s</span>
              <span className="badge-subtitle">
                TARGET: [{capturedFrame.targetPosition?.x}, {capturedFrame.targetPosition?.z}]
              </span>
            </div>

            <div className="frame-overlay-badge bottom-left">
              <span className="badge-title">ESTIMATED RANGE</span>
              <span className="badge-value">{capturedFrame.distance} m</span>
            </div>

            <div className="frame-overlay-badge bottom-right">
              <span className="badge-title">ACQUISITION TIME</span>
              <span className="badge-value">{capturedFrame.formattedTime}</span>
            </div>

            {/* Center Reticle */}
            <div className="detection-reticle">+</div>
          </div>
        ) : (
          <div className="camera-placeholder">
            <div className="placeholder-icon">
              <FaCamera />
            </div>
            <h2>No Captured Sensor Frame</h2>
            <p>
              Navigate to the Sensors page and click <strong>[CAPTURE FRAME]</strong> to acquire a sensor POV for computer-vision processing.
            </p>
            <button
              className="goto-sensors-btn"
              onClick={() => navigate("/sensors")}
            >
              <FaSatellite />
              <span>Go to Sensors Page</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetectionViewer;