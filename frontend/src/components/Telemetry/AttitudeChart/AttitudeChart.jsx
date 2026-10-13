import "./AttitudeChart.css";
import StaticLineChart from "../StaticLineChart";

const attitudeData = [
  { roll: 12.1, pitch: -6.5, yaw: 100.2 },
  { roll: 12.4, pitch: -6.8, yaw: 101.5 },
  { roll: 12.7, pitch: -7.1, yaw: 102.3 },
  { roll: 13.0, pitch: -7.4, yaw: 103.1 },
  { roll: 13.2, pitch: -7.6, yaw: 103.8 },
  { roll: 13.5, pitch: -7.9, yaw: 104.2 },
  { roll: 13.8, pitch: -8.1, yaw: 104.8 },
  { roll: 14.0, pitch: -8.2, yaw: 105.1 },
  { roll: 14.1, pitch: -8.3, yaw: 105.4 },
  { roll: 14.2, pitch: -8.4, yaw: 105.6 }
];

function AttitudeChart() {
  return (
    <div className="attitude-chart">
      <div className="chart-header">
        <h3>Attitude</h3>
        <span>
          <span style={{color: "#f43f5e"}}>Roll</span> • <span style={{color: "#10b981"}}>Pitch</span> • <span style={{color: "#8b5cf6"}}>Yaw</span>
        </span>
      </div>
      <div style={{ height: "250px", width: "100%", padding: "10px" }}>
        <StaticLineChart 
          data={attitudeData} 
          yLabel="Angle" 
          yUnits="°" 
          lines={[
            { key: "roll", color: "#f43f5e" },
            { key: "pitch", color: "#10b981" },
            { key: "yaw", color: "#8b5cf6" }
          ]}
        />
      </div>
    </div>
  );
}

export default AttitudeChart;