import "./DisplaySettings.css";

function DisplaySettings() {
  return (
    <div className="display-settings">

      <h2>Display Settings</h2>

      <div className="settings-grid">

        <div className="checkbox-item">
          <input
            type="checkbox"
            defaultChecked
          />
          <label>Show Bounding Boxes</label>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            defaultChecked
          />
          <label>Show Object Labels</label>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            defaultChecked
          />
          <label>Show Coordinate Axes</label>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            defaultChecked
          />
          <label>Show Camera Frustum</label>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            defaultChecked
          />
          <label>Show Trajectory</label>
        </div>

        <div className="setting-item">

          <label>Theme</label>

          <select>
            <option>Dark</option>
            <option>Light</option>
          </select>

        </div>

      </div>

    </div>
  );
}

export default DisplaySettings;