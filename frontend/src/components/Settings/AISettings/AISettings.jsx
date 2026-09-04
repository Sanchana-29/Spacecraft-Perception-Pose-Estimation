import "./AISettings.css";

function AISettings() {
  return (
    <div className="ai-settings">

      <h2>AI Settings</h2>

      <div className="settings-grid">

        <div className="setting-item">
          <label>YOLO Model</label>

          <select>
            <option>YOLOv8</option>
            <option>YOLOv11</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Confidence Threshold</label>

          <input
            type="range"
            min="0"
            max="100"
            defaultValue="80"
          />
        </div>

        <div className="setting-item">
          <label>Tracking Algorithm</label>

          <select>
            <option>ByteTrack</option>
            <option>DeepSORT</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Pose Algorithm</label>

          <select>
            <option>SolvePnP</option>
            <option>EPnP</option>
            <option>IPPE</option>
          </select>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            defaultChecked
          />

          <label>Enable Detection</label>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            defaultChecked
          />

          <label>Enable Tracking</label>
        </div>

      </div>

    </div>
  );
}

export default AISettings;