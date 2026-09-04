import "./PoseControls.css";

function PoseControls() {
  return (
    <div className="pose-controls">

      <div className="control-group">
        <label>Algorithm</label>

        <select>
          <option>SolvePnP</option>
          <option>EPnP</option>
          <option>IPPE</option>
        </select>
      </div>

      <div className="control-group">
        <label>Feature</label>

        <select>
          <option>ORB</option>
          <option>SIFT</option>
          <option>SURF</option>
        </select>
      </div>

      <div className="control-group">
        <label>Target</label>

        <select>
          <option>SAT-001</option>
          <option>SAT-002</option>
          <option>Debris-001</option>
        </select>
      </div>

      <div className="control-group">
        <label>Status</label>

        <div className="status">
          ● Pose Locked
        </div>
      </div>

    </div>
  );
}

export default PoseControls;