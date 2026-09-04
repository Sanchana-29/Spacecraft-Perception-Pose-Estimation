import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import Scene from "../components/Scene/Scene";
import { getSystemStatus } from "../services/api.js";

function Dashboard() {
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
          style={{
            position: "absolute",
            top: "20px",
            left: "70px",
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
      </div>
    </Layout>
  );
}

export default Dashboard;