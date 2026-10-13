import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaSatellite, FaRedo, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useSensor } from "../../../context/SensorContext";
import "./DetectionViewer.css";

function DetectionViewer() {
  const { capturedFrame, detectionResult, isDetecting, detectionError } = useSensor();
  const navigate = useNavigate();
  const [imageDims, setImageDims] = useState({ w: 0, h: 0 });

  const handleImageLoad = (e) => {
    setImageDims({
      w: e.target.naturalWidth || e.target.width,
      h: e.target.naturalHeight || e.target.height,
    });
  };

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
            {isDetecting
              ? "🟡 PROCESSING OpenCV..."
              : detectionResult?.detected
              ? "🟢 TARGET DETECTED"
              : detectionResult?.detected === false
              ? "🔴 TARGET ABSENT"
              : capturedFrame
              ? "🟢 FRAME LOADED"
              : "🟡 AWAITING INPUT"}
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
              onLoad={handleImageLoad}
            />

            {/* BOUNDING BOX OVERLAY FROM BACKEND RESPONSE */}
            {detectionResult?.detected && Array.isArray(detectionResult.detections) && detectionResult.detections.map((det, index) => (
              <div
                key={index}
                className="bounding-box-overlay"
                style={{
                  left: imageDims.w
                    ? `${(det.bounding_box.x / imageDims.w) * 100}%`
                    : `${det.bounding_box.x}px`,
                  top: imageDims.h
                    ? `${(det.bounding_box.y / imageDims.h) * 100}%`
                    : `${det.bounding_box.y}px`,
                  width: imageDims.w
                    ? `${(det.bounding_box.width / imageDims.w) * 100}%`
                    : `${det.bounding_box.width}px`,
                  height: imageDims.h
                    ? `${(det.bounding_box.height / imageDims.h) * 100}%`
                    : `${det.bounding_box.height}px`,
                }}
              >
                <span className="bounding-box-label">
                  <FaCheckCircle style={{ marginRight: 4 }} />
                  {det.id || `SAT-00${index + 1}`} ({Math.round(det.confidence * 100)}%)
                </span>
              </div>
            ))}

            {/* TARGET NOT DETECTED OVERLAY */}
            {detectionResult && !detectionResult.detected && (
              <div className="detection-alert-badge absent">
                <FaTimesCircle />
                <span>Target not detected in current frame</span>
              </div>
            )}

            {/* DETECTION ERROR OVERLAY */}
            {detectionError && (
              <div className="detection-alert-badge error">
                <FaExclamationTriangle />
                <span>{detectionError}</span>
              </div>
            )}

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