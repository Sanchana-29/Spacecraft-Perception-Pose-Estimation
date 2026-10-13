import "./VelocityChart.css";
import StaticLineChart from "../StaticLineChart";

const velocityData = [
  { v: 0.8 }, { v: 0.78 }, { v: 0.76 }, { v: 0.75 },
  { v: 0.72 }, { v: 0.69 }, { v: 0.65 }, { v: 0.62 },
  { v: 0.60 }, { v: 0.58 }
];

function VelocityChart() {
  return (
    <div className="velocity-chart">
      <div className="chart-header">
        <h3>Relative Velocity</h3>
        <span>Velocity vs Time</span>
      </div>
      <div style={{ height: "250px", width: "100%", padding: "10px" }}>
        <StaticLineChart 
          data={velocityData} 
          yKey="v" 
          yLabel="Velocity" 
          yUnits="m/s" 
          color="#f59e0b" 
        />
      </div>
    </div>
  );
}

export default VelocityChart;