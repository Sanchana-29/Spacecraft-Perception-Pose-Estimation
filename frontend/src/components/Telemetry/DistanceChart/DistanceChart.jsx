import "./DistanceChart.css";
import StaticLineChart from "../StaticLineChart";

const distanceData = [
  { distance: 15.2 }, { distance: 14.8 }, { distance: 14.5 }, { distance: 13.9 },
  { distance: 13.5 }, { distance: 13.1 }, { distance: 12.8 }, { distance: 12.6 },
  { distance: 12.5 }, { distance: 12.4 }
];

function DistanceChart() {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Relative Distance</h3>
        <span>Distance vs Time</span>
      </div>
      <div style={{ height: "250px", width: "100%", padding: "10px" }}>
        <StaticLineChart 
          data={distanceData} 
          yKey="distance" 
          yLabel="Distance" 
          yUnits="m" 
          color="#3b82f6" 
        />
      </div>
    </div>
  );
}

export default DistanceChart;