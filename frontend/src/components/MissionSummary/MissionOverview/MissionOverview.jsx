import "./MissionOverview.css";

function MissionOverview() {
  return (
    <div className="mission-overview">

      <div className="overview-header">

        <h2>Mission Overview</h2>

        <div className="mission-status">
          🟢 Mission Active
        </div>

      </div>

      <div className="overview-grid">

        <div className="overview-card">
          <span>Mission Name</span>
          <h3>Autonomous Rendezvous</h3>
        </div>

        <div className="overview-card">
          <span>Mission ID</span>
          <h3>MSN-001</h3>
        </div>

        <div className="overview-card">
          <span>Operator</span>
          <h3>SpaceTug</h3>
        </div>

        <div className="overview-card">
          <span>Mission Time</span>
          <h3>00:00:00</h3>
        </div>

      </div>

    </div>
  );
}

export default MissionOverview;