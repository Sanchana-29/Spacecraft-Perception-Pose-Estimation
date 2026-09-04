import "./SimulationSettings.css";

function SimulationSettings() {
  return (
    <div className="simulation-settings">

      <h2>Simulation Settings</h2>

      <div className="settings-grid">

        <div className="setting-item">
          <label>Simulation Speed</label>

          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            defaultValue="1"
          />
        </div>

        <div className="setting-item">
          <label>Orbit Speed</label>

          <input
            type="range"
            min="1"
            max="10"
            defaultValue="5"
          />
        </div>

        <div className="setting-item">
          <label>Docking Distance</label>

          <input
            type="number"
            defaultValue="0.5"
          />
        </div>

        <div className="setting-item">
          <label>Mission Mode</label>

          <select>
            <option>Autonomous</option>
            <option>Manual</option>
          </select>
        </div>

      </div>

    </div>
  );
}

export default SimulationSettings;