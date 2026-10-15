
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCamera,
  FaSatellite,
  FaRedo,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useSensor } from "../../../context/SensorContext";
import "./DetectionViewer.css";

function DetectionViewer() {
  const {
    capturedFrame,
    detectionResult,
    isDetecting,
    detectionError,
  } = useSensor();

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [imageDims, setImageDims] = useState({ w: 0, h: 0 });
  const [displayRect, setDisplayRect] = useState(null);

  const handleImageLoad = (e) => {
    const w = e.target.naturalWidth || e.target.width;
    const h = e.target.naturalHeight || e.target.height;
    if (w && h) {
      setImageDims({ w, h });
    }
  };

  const updateDisplayRect = useCallback(() => {
    if (!containerRef.current) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    if (!cw || !ch) return;

    const w = imageDims.w || detectionResult?.image_width;
    const h = imageDims.h || detectionResult?.image_height;

    if (!w || !h) {
      setDisplayRect(null);
      return;
    }

    const imgAspect = w / h;
    const containerAspect = cw / ch;

    let dw, dh;
    if (containerAspect > imgAspect) {
      dh = ch;
      dw = ch * imgAspect;
    } else {
      dw = cw;
      dh = cw / imgAspect;
    }

    setDisplayRect({
      width: Math.floor(dw),
      height: Math.floor(dh),
    });
  }, [imageDims, detectionResult]);

  useEffect(() => {
    updateDisplayRect();
  }, [updateDisplayRect]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => {
      updateDisplayRect();
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [updateDisplayRect]);

  const detections = Array.isArray(detectionResult?.detections)
    ? detectionResult.detections
    : [];

  const hasDetections = detectionResult?.detected && detections.length > 0;
  const isTargetAbsent =
    detectionResult &&
    (detectionResult.detected === false || detections.length === 0);

  return (
    <div className="detection-viewer">
      <div className="viewer-header">
        <div>
          <h3>Detection Viewer</h3>
          <span>
            {capturedFrame
              ? `${capturedFrame.selectedSensor || capturedFrame.sensor || "Sensor"} Captured Input`
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
              ? "🟡 PROCESSING YOLOv8n..."
              : detectionError
              ? "🔴 DETECTION ERROR"
              : hasDetections
              ? `🟢 TARGET DETECTED (${detections.length})`
              : isTargetAbsent
              ? "🔴 TARGET ABSENT"
              : capturedFrame
              ? "🟢 FRAME LOADED"
              : "🟡 AWAITING INPUT"}
          </div>
        </div>
      </div>

      <div className="viewer-body">
        {capturedFrame ? (
          <div className="captured-frame-container" ref={containerRef}>
            <div
              className="image-stage-wrapper"
              style={{
                width: displayRect ? `${displayRect.width}px` : "100%",
                height: displayRect ? `${displayRect.height}px` : "100%",
              }}
            >
              <img
                src={capturedFrame.imageData}
                alt="Captured Sensor Frame"
                className="captured-frame-image"
                onLoad={handleImageLoad}
              />

              {/* Bounding boxes returned by the backend YOLOv8n model */}
              {hasDetections &&
                detections.map((det, index) => {
                  const bbox = det.bounding_box;

                  if (
                    !bbox ||
                    !Number.isFinite(bbox.x) ||
                    !Number.isFinite(bbox.y) ||
                    !Number.isFinite(bbox.width) ||
                    !Number.isFinite(bbox.height) ||
                    bbox.width <= 0 ||
                    bbox.height <= 0
                  ) {
                    return null;
                  }

                  const origW = imageDims.w || detectionResult?.image_width || 1;
                  const origH = imageDims.h || detectionResult?.image_height || 1;

                  const leftPct = Math.max(0, Math.min(100, (bbox.x / origW) * 100));
                  const topPct = Math.max(0, Math.min(100, (bbox.y / origH) * 100));
                  const widthPct = Math.max(
                    0,
                    Math.min(100 - leftPct, (bbox.width / origW) * 100)
                  );
                  const heightPct = Math.max(
                    0,
                    Math.min(100 - topPct, (bbox.height / origH) * 100)
                  );

                  const hasConfidence =
                    typeof det.confidence === "number" &&
                    Number.isFinite(det.confidence);

                  const label = det.class_name || det.id || `Satellite ${index + 1}`;
                  const isTopEdge = topPct < 7;

                  return (
                    <div
                      key={`${det.id || "satellite"}-${index}`}
                      className="bounding-box-overlay"
                      style={{
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                        width: `${widthPct}%`,
                        height: `${heightPct}%`,
                      }}
                    >
                      <span
                        className={`bounding-box-label ${isTopEdge ? "inside-top" : ""}`}
                      >
                        <FaCheckCircle style={{ marginRight: 4 }} />
                        {label}
                        {hasConfidence
                          ? ` (${Math.round(det.confidence * 100)}%)`
                          : ""}
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* Target not detected */}
            {isTargetAbsent && !isDetecting && (
              <div className="detection-alert-badge absent">
                <FaTimesCircle />
                <span>Target not detected in current frame</span>
              </div>
            )}

            {/* Detection error */}
            {detectionError && (
              <div className="detection-alert-badge error">
                <FaExclamationTriangle />
                <span>{detectionError}</span>
              </div>
            )}

            {/* Sensor HUD */}
            <div className="frame-overlay-badge top-left">
              <span className="badge-title">SENSOR / FOV</span>
              <span className="badge-value">
                {capturedFrame.selectedSensor || capturedFrame.sensor || "Sensor"}
                {" "}({capturedFrame.fov ?? 60}°)
              </span>
              <span className="badge-subtitle">
                CHASER: [
                {capturedFrame.chaserPosition?.x ?? "--"},{" "}
                {capturedFrame.chaserPosition?.z ?? "--"}]
              </span>
            </div>

            <div className="frame-overlay-badge top-right">
              <span className="badge-title">MISSION TIME</span>
              <span className="badge-value">
                {capturedFrame.missionTime != null
                  ? `T+${capturedFrame.missionTime}s`
                  : "--"}
              </span>
              <span className="badge-subtitle">
                TARGET: [
                {capturedFrame.targetPosition?.x ?? "--"},{" "}
                {capturedFrame.targetPosition?.z ?? "--"}]
              </span>
            </div>

            {/* Simulation distance is not a CV pose estimate */}
            <div className="frame-overlay-badge bottom-left">
              <span className="badge-title">CV RANGE</span>
              <span className="badge-value">N/A</span>
            </div>

            <div className="frame-overlay-badge bottom-right">
              <span className="badge-title">ACQUISITION TIME</span>
              <span className="badge-value">
                {capturedFrame.formattedTime || "--"}
              </span>
            </div>

            <div className="detection-reticle">+</div>
          </div>
        ) : (
          <div className="camera-placeholder">
            <div className="placeholder-icon">
              <FaCamera />
            </div>
            <h2>No Captured Sensor Frame</h2>
            <p>
              Navigate to the Sensors page and click{" "}
              <strong>[CAPTURE FRAME]</strong> to acquire a sensor POV for
              computer-vision processing.
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
