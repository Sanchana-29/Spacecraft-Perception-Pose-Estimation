
import "./DetectionTable.css";
import { useSensor } from "../../../context/SensorContext";

function DetectionTable() {
  const { capturedFrame, detectionResult, isDetecting, detectionError } = useSensor();

  const detections =
    detectionResult?.detected &&
    Array.isArray(detectionResult.detections)
      ? detectionResult.detections.map((det, index) => {
          const confidenceStr =
            typeof det.confidence === "number" && Number.isFinite(det.confidence)
              ? `${(det.confidence * 100).toFixed(1)}%`
              : "--";

          return {
            id: det.id ?? `SAT-${String(index + 1).padStart(3, "0")}`,
            className: det.class_name ?? "satellite",
            confidence: confidenceStr,
            trackId: "--",
            status: "DETECTED",
            target: det.class_name ? det.class_name.toUpperCase() : "SATELLITE",
          };
        })
      : [];

  let emptyMessage = "Awaiting Detection (Click RUN DETECTION)";

  if (isDetecting) {
    emptyMessage = "Detection in progress...";
  } else if (detectionError) {
    emptyMessage = `Inference failed: ${detectionError}`;
  } else if (!capturedFrame) {
    emptyMessage = "No sensor frame loaded (Capture frame on Sensors page)";
  } else if (detectionResult && (!detectionResult.detected || detections.length === 0)) {
    emptyMessage = "No target detected above confidence threshold";
  }

  return (
    <div className="detection-table">
      <div className="table-header">
        <h3>Detected Objects</h3>
        <span>
          {detections.length} Object{detections.length === 1 ? "" : "s"}
        </span>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Class</th>
            <th>Confidence</th>
            <th>Track ID</th>
            <th>Status</th>
            <th>Target</th>
          </tr>
        </thead>

        <tbody>
          {detections.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            detections.map((item, index) => (
              <tr key={`${item.id}-${index}`}>
                <td>{item.id}</td>
                <td>{item.className}</td>
                <td>{item.confidence}</td>
                <td>{item.trackId}</td>
                <td>{item.status}</td>
                <td>{item.target}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DetectionTable;
