import "./AttitudeChart.css";

function AttitudeChart() {
  return (
    <div className="attitude-chart">

      <div className="chart-header">

        <h3>Attitude</h3>

        <span>Roll • Pitch • Yaw</span>

      </div>

      <div className="chart-placeholder">

        <h2>📊</h2>

        <p>Attitude Graph</p>

      </div>

    </div>
  );
}

export default AttitudeChart;