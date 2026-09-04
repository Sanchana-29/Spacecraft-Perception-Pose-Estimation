import "./SensorInformation.css";

function SensorInformation() {
  return (
    <div className="sensor-information">
      <h2>Sensor Information</h2>

      <div className="info-row">
        <span>Status</span>
        <span>🟢 Active</span>
      </div>

      <div className="info-row">
        <span>Sensor Type</span>
        <span>RGB Camera</span>
      </div>

      <div className="info-row">
        <span>Connection</span>
        <span>Connected</span>
      </div>

      <div className="info-row">
        <span>Last Update</span>
        <span>Now</span>
      </div>
    </div>
  );
}

export default SensorInformation;