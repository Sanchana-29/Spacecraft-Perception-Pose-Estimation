import "./SensorConfiguration.css";

function SensorConfiguration() {
  return (
    <div className="sensor-config">
      <h2>Sensor Configuration</h2>

      <div className="config-row">
        <span>Resolution</span>
        <span>1920 × 1080</span>
      </div>

      <div className="config-row">
        <span>FPS</span>
        <span>30</span>
      </div>

      <div className="config-row">
        <span>FOV</span>
        <span>70°</span>
      </div>

      <div className="config-row">
        <span>Calibration</span>
        <span>Completed</span>
      </div>
    </div>
  );
}

export default SensorConfiguration;