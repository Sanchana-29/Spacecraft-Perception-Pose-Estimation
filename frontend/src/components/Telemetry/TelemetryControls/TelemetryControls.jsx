import "./TelemetryControls.css";

function TelemetryControls() {
  return (
    <div className="telemetry-controls">

      <div className="control-group">
        <label>Mission Time</label>
        <div className="control-value">
          00:00:00
        </div>
      </div>

      <div className="control-group">
        <label>Update Rate</label>

        <select>
          <option>10 Hz</option>
          <option>20 Hz</option>
          <option>30 Hz</option>
        </select>
      </div>

      <div className="control-group">
        <label>Recording</label>

        <div className="status">
          ● OFF
        </div>
      </div>

      <div className="control-group">
        <label>Telemetry Status</label>

        <div className="status">
          ● LIVE
        </div>
      </div>

    </div>
  );
}

export default TelemetryControls;