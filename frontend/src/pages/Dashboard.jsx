import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import Scene from "../components/Scene/Scene";
import { getSystemStatus } from "../services/api.js";
import { useSimulation } from "../context/SimulationContext";
import "./Dashboard.css";

function Dashboard() {
  const { selectedObject, trackingTarget, setTrackingTarget, isTracking, setIsTracking } = useSimulation();
  
  const [backendStatus, setBackendStatus] = useState("Connecting...");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function checkBackend() {
      try {
        const data = await getSystemStatus();

        if (data.backend === "online") {
          setBackendStatus("ONLINE");
          setError(false);
        }
      } catch (err) {
        console.warn("Backend status check failed:", err);
        setBackendStatus("OFFLINE");
        setError(true);
      }
    }

    checkBackend();
  }, []);

  return (
    <Layout>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <Scene />

        {/* Backend Status */}
        <div
          className="dashboard-status-badge"
          style={{
            position: "absolute",
            top: "20px",
            padding: "10px 16px",
            borderRadius: "8px",
            background: "#111a2c",
            border: "1px solid #24324d",
            color: "white",
            fontSize: "13px",
            zIndex: 10,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: error ? "#ef4444" : "#4ade80",
              marginRight: "8px",
            }}
          />

          Backend: <strong>{backendStatus}</strong>
        </div>

        {/* Tracking Status Panel */}
        <div
          className="dashboard-status-badge"
          style={{
            position: "absolute",
            top: "70px",
            padding: "16px",
            borderRadius: "8px",
            background: "#111a2c",
            border: "1px solid #24324d",
            color: "white",
            fontSize: "13px",
            zIndex: 10,
            width: "200px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "8px", letterSpacing: "1px" }}>TARGET</div>
          <div style={{ borderBottom: "1px solid #24324d", margin: "0 -16px 8px -16px" }} />
          
          <div style={{ marginBottom: "4px" }}>
            <span style={{ color: "#94a3b8" }}>Selected: </span>
            <span>{selectedObject?.id || "None"}</span>
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <span style={{ color: "#94a3b8" }}>Status: </span>
            <span style={{ color: isTracking ? "#4ade80" : "#94a3b8", fontWeight: isTracking ? "bold" : "normal" }}>
              {isTracking ? "TRACKING" : (selectedObject?.type === "Target Spacecraft" ? "ACTIVE" : "NOT TRACKING")}
            </span>
          </div>

          {isTracking ? (
            <button
              onClick={() => {
                setTrackingTarget(null);
                setIsTracking(false);
              }}
              style={{
                width: "100%",
                padding: "8px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              STOP TRACKING
            </button>
          ) : selectedObject && selectedObject.type === "Target Spacecraft" ? (
            <button
              onClick={() => {
                setTrackingTarget(selectedObject);
                setIsTracking(true);
              }}
              style={{
                width: "100%",
                padding: "8px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              TRACK TARGET
            </button>
          ) : (
            <button
              disabled
              style={{
                width: "100%",
                padding: "8px",
                background: "#1e293b",
                color: "#64748b",
                border: "none",
                borderRadius: "4px",
                cursor: "not-allowed",
                fontWeight: "bold",
              }}
            >
              TRACK TARGET
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;