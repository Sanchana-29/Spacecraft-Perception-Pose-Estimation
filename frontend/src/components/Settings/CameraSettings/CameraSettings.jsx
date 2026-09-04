import "./CameraSettings.css";

function CameraSettings() {
  return (
    <div className="camera-settings">

      <h2>Camera Settings</h2>

      <div className="settings-grid">

        <div className="setting-item">
          <label>Sensor</label>

          <select>
            <option>RGB-D Camera</option>
            <option>Stereo Camera</option>
            <option>Thermal Camera</option>
            <option>LiDAR</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Resolution</label>

          <select>
            <option>1920 × 1080</option>
            <option>1280 × 720</option>
            <option>640 × 480</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Frame Rate</label>

          <select>
            <option>30 FPS</option>
            <option>60 FPS</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Field of View</label>

          <input
            type="range"
            min="40"
            max="120"
            defaultValue="70"
          />
        </div>

      </div>

    </div>
  );
}

export default CameraSettings;