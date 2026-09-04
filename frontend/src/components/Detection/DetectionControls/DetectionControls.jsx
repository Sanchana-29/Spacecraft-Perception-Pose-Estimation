import "./DetectionControls.css";

function DetectionControls() {
  return (
    <div className="detection-controls">

      <div className="control-group">
        <label>Confidence</label>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="80"
        />
        <span>80%</span>
      </div>

      <div className="control-group">
        <label>Model</label>
        <select>
          <option>YOLOv8</option>
          <option>YOLOv11</option>
        </select>
      </div>

      <div className="control-group">
        <label>Tracking</label>
        <div className="status on">
          ● ON
        </div>
      </div>

      <div className="control-group">
        <label>FPS</label>
        <div className="fps">
          60
        </div>
      </div>

    </div>
  );
}

export default DetectionControls;