import "./TargetSummary.css";

import {
  FaSatellite,
  FaCube,
  FaRuler,
  FaCompass,
} from "react-icons/fa";

function TargetSummary() {
  return (
    <div className="target-summary">

      <div className="target-header">

        <h2>Target Summary</h2>

        <span className="target-status">
          🟢 Target Locked
        </span>

      </div>

      <div className="target-grid">

        <div className="target-card">
          <FaSatellite className="target-icon" />
          <div>
            <span>Target ID</span>
            <h3>SAT-001</h3>
          </div>
        </div>

        <div className="target-card">
          <FaCube className="target-icon" />
          <div>
            <span>Object Type</span>
            <h3>Satellite</h3>
          </div>
        </div>

        <div className="target-card">
          <FaRuler className="target-icon" />
          <div>
            <span>Final Distance</span>
            <h3>-- m</h3>
          </div>
        </div>

        <div className="target-card">
          <FaCompass className="target-icon" />
          <div>
            <span>Final Orientation</span>
            <h3>-- °</h3>
          </div>
        </div>

      </div>

    </div>
  );
}

export default TargetSummary;