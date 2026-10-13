import "./TargetSummary.css";

import {
  FaSatellite,
  FaCube,
  FaRuler,
  FaCompass,
  FaEye,
  FaCrosshairs,
  FaCamera,
} from "react-icons/fa";

function TargetSummary() {
  return (
    <div className="target-summary">

      <div className="target-header">

        <h2>Perception & Relative State</h2>

        <span className="target-status">
          🟢 Target Detected & Tracked
        </span>

      </div>

      <div className="target-grid">

        <div className="target-card">
          <FaSatellite className="target-icon" />
          <div>
            <span>Target Type</span>
            <h3>Target Spacecraft</h3>
          </div>
        </div>

        <div className="target-card">
          <FaEye className="target-icon" />
          <div>
            <span>Perception Status</span>
            <h3>Detected / Active</h3>
          </div>
        </div>

        <div className="target-card">
          <FaCrosshairs className="target-icon" />
          <div>
            <span>Pose Status</span>
            <h3>Pose Estimation Ready</h3>
          </div>
        </div>

        <div className="target-card">
          <FaCamera className="target-icon" />
          <div>
            <span>Sensor Source</span>
            <h3>RGB-D Camera</h3>
          </div>
        </div>

        <div className="target-card">
          <FaRuler className="target-icon" />
          <div>
            <span>Relative Distance</span>
            <h3>12.4 m</h3>
          </div>
        </div>

        <div className="target-card">
          <FaCompass className="target-icon" />
          <div>
            <span>Relative Velocity</span>
            <h3>0.82 m/s</h3>
          </div>
        </div>

        <div className="target-card">
          <FaCube className="target-icon" />
          <div>
            <span>Relative Position</span>
            <h3>X: 12.45m | Y: -3.21m | Z: 8.67m</h3>
          </div>
        </div>

        <div className="target-card">
          <FaCompass className="target-icon" />
          <div>
            <span>Attitude (R / P / Y)</span>
            <h3>14.2° / -8.4° / 105.6°</h3>
          </div>
        </div>

      </div>

    </div>
  );
}

export default TargetSummary;