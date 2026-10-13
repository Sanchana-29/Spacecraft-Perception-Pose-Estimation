import "./DetectionTable.css";
import { useSensor } from "../../../context/SensorContext";

function DetectionTable() {
  const { detectionResult } = useSensor();

  const detections = detectionResult?.detected && Array.isArray(detectionResult.detections) 
    ? detectionResult.detections.map((det, index) => ({
        id: det.id || `SAT-00${index + 1}`,
        class: det.class_name || "Target Satellite",
        confidence: `${det.confidence * 100}%`,
        trackId: `TRK-00${index + 1}`,
        status: "DETECTED",
        target: "TRUE",
      }))
    : [];

  return (
    <div className="detection-table">
      <div className="table-header">
        <h3>Detected Objects</h3>
        <span>{detections.length} Object{detections.length === 1 ? "" : "s"}</span>
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
                {detectionResult?.detected === false
                  ? "Target Not Detected by OpenCV"
                  : "No Objects Detected (Click [RUN DETECTION])"}
              </td>
            </tr>
          ) : (
            detections.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.class}</td>
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