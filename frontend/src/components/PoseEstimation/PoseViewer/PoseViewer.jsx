import "./PoseViewer.css";

function PoseViewer() {
  return (
    <div className="pose-viewer">

      <div className="viewer-header">

        <div>
          <h3>3D Pose Viewer</h3>
          <span>Target : SAT-001</span>
        </div>

        <div className="viewer-status">
          🟢 LIVE
        </div>

      </div>

      <div className="viewer-body">

        <div className="pose-placeholder">

          <div className="satellite">

            🛰

          </div>

          <div className="axes">

            X &nbsp;&nbsp; Y &nbsp;&nbsp; Z

          </div>

          <h2>No Pose Available</h2>

          <p>
            Waiting for Pose Estimation...
          </p>

        </div>

      </div>

    </div>
  );
}

export default PoseViewer;