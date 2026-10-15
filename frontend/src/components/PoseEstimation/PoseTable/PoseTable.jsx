import "./PoseTable.css";
import { useState } from "react";

function PoseTable() {
  const [activeTab, setActiveTab] = useState("matrix");

  // Mathematically calculated 3x3 rotation matrix for Roll=14.2°, Pitch=-8.4°, Yaw=105.6°
  const matrixData = [
    { row: "Row 1", r1: "-0.2660", r2: "-0.9241", r3: "0.2744", t: "12.45 m" },
    { row: "Row 2", r1: "0.9528", r2: "-0.2952", r3: "-0.0704", t: "-3.21 m" },
    { row: "Row 3", r1: "0.1461", r2: "0.2427", r3: "0.9590", t: "8.67 m" },
  ];

  return (
    <div className="pose-table">

      <div className="pose-tabs">

        <button
          className={activeTab === "matrix" ? "active" : ""}
          onClick={() => setActiveTab("matrix")}
        >
          Pose Matrix
        </button>

        <button
          className={activeTab === "euler" ? "active" : ""}
          onClick={() => setActiveTab("euler")}
        >
          Euler Angles
        </button>

        <button
          className={activeTab === "quaternion" ? "active" : ""}
          onClick={() => setActiveTab("quaternion")}
        >
          Quaternion
        </button>

        <button
          className={activeTab === "relative" ? "active" : ""}
          onClick={() => setActiveTab("relative")}
        >
          Relative State
        </button>

      </div>

      <div className="pose-content">

        {activeTab === "matrix" && (
          <table style={{ width: "100%", tableLayout: "auto" }}>
            <thead>
              <tr style={{ color: "#8ca8d8", borderBottom: "1px solid #26334d", textAlign: "left" }}>
                <th style={{ padding: "8px 6px", fontSize: "13px" }}>Row</th>
                <th style={{ padding: "8px 6px", fontSize: "13px" }}>R1</th>
                <th style={{ padding: "8px 6px", fontSize: "13px" }}>R2</th>
                <th style={{ padding: "8px 6px", fontSize: "13px" }}>R3</th>
                <th style={{ padding: "8px 6px", fontSize: "13px" }}>T</th>
              </tr>
            </thead>
            <tbody>
              {matrixData.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "8px 6px", color: "#8ca8d8", fontWeight: "bold", fontSize: "13px", whiteSpace: "nowrap" }}>{item.row}</td>
                  <td style={{ padding: "8px 6px", fontSize: "13px" }}>{item.r1}</td>
                  <td style={{ padding: "8px 6px", fontSize: "13px" }}>{item.r2}</td>
                  <td style={{ padding: "8px 6px", fontSize: "13px" }}>{item.r3}</td>
                  <td style={{ padding: "8px 6px", color: "#60a5fa", fontWeight: "bold", fontSize: "13px", whiteSpace: "nowrap" }}>{item.t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "euler" && (
          <table>
            <tbody>
              <tr>
                <td style={{ color: "#8ca8d8" }}>Roll (X)</td>
                <td style={{ fontWeight: "bold" }}>14.2000 °</td>
              </tr>
              <tr>
                <td style={{ color: "#8ca8d8" }}>Pitch (Y)</td>
                <td style={{ fontWeight: "bold" }}>-8.4000 °</td>
              </tr>
              <tr>
                <td style={{ color: "#8ca8d8" }}>Yaw (Z)</td>
                <td style={{ fontWeight: "bold" }}>105.6000 °</td>
              </tr>
            </tbody>
          </table>
        )}

        {activeTab === "quaternion" && (
          <table>
            <tbody>
              <tr>
                <td style={{ color: "#8ca8d8" }}>qw (scalar)</td>
                <td style={{ fontWeight: "bold" }}>0.6558</td>
              </tr>
              <tr>
                <td style={{ color: "#8ca8d8" }}>qx</td>
                <td style={{ fontWeight: "bold" }}>0.1170</td>
              </tr>
              <tr>
                <td style={{ color: "#8ca8d8" }}>qy</td>
                <td style={{ fontWeight: "bold" }}>-0.0381</td>
              </tr>
              <tr>
                <td style={{ color: "#8ca8d8" }}>qz</td>
                <td style={{ fontWeight: "bold" }}>0.7448</td>
              </tr>
            </tbody>
          </table>
        )}

        {activeTab === "relative" && (
          <table>
            <tbody>
              <tr>
                <td style={{ color: "#8ca8d8" }}>Relative Distance</td>
                <td style={{ fontWeight: "bold", color: "#60a5fa" }}>12.45 m</td>
              </tr>
              <tr>
                <td style={{ color: "#8ca8d8" }}>Relative Speed</td>
                <td style={{ fontWeight: "bold", color: "#4ade80" }}>0.82 m/s</td>
              </tr>
              <tr>
                <td style={{ color: "#8ca8d8" }}>Tracking Status</td>
                <td style={{ fontWeight: "bold", color: "#4ade80" }}>Locked / Active</td>
              </tr>
            </tbody>
          </table>
        )}

      </div>

    </div>
  );
}

export default PoseTable;