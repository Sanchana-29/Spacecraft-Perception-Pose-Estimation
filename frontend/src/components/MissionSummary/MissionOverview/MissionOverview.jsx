import "./MissionOverview.css";

function MissionOverview() {
  return (
    <div className="mission-overview">

      <div className="overview-header">

        <h2>Mission Overview</h2>

        <div className="mission-status">
          🟢 ACTIVE
        </div>

      </div>

      <div className="overview-grid">

        <div className="overview-card">
          <span>Mission Name</span>
          <h3>Spacecraft Proximity Operations</h3>
        </div>

        <div className="overview-card">
          <span>Mission ID</span>
          <h3>STOS-MISSION-001</h3>
        </div>

        <div className="overview-card">
          <span>Target ID</span>
          <h3>SAT-001</h3>
        </div>

        <div className="overview-card">
          <span>Mission Time</span>
          <h3>T+145.6 s</h3>
        </div>

      </div>

    </div>
  );
}

export default MissionOverview;