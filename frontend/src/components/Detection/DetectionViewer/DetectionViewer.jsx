import "./DetectionViewer.css";

function DetectionViewer() {
  return (
    <div className="detection-viewer">

      <div className="viewer-header">

        <div>
          <h3>Detection Viewer</h3>
          <span>RGB-D Camera Feed</span>
        </div>

        <div className="viewer-status">
          🟢 LIVE
        </div>

      </div>

      <div className="viewer-body">

        <div className="camera-placeholder">

          <h2>No Camera Feed</h2>

          <p>
            Select a Sensor to Start Detection
          </p>

        </div>

      </div>

    </div>
  );
}

export default DetectionViewer;