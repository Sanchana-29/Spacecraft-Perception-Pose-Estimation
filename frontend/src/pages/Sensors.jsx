import { useEffect, useState } from "react";

import Layout from "../components/Layout/Layout";

import "./Sensors.css";

import SensorTabs from "../components/Sensors/SensorTabs/SensorTabs";
import SensorViewer from "../components/Sensors/SensorViewer/SensorViewer";

import { getSensorData } from "../services/api.js";


function Sensors() {

  const [sensorData, setSensorData] = useState(null);

  const [backendError, setBackendError] =
    useState(false);


  // ==========================================
  // LOAD SENSOR DATA
  // ==========================================

  useEffect(() => {

    async function loadSensorData() {

      try {

        const data =
          await getSensorData();

        setSensorData(data);

        setBackendError(false);

      } catch (error) {

        console.error(
          "Sensor API Error:",
          error
        );

        setBackendError(true);

      }

    }

    loadSensorData();

  }, []);


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <Layout
      showInspector={false}
      showFooter={true}
    >

      <div className="sensors-page">


        {/* =====================================
            BACKEND STATUS
            ===================================== */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "fit-content",
            marginLeft: "60px",
            padding: "8px 14px",
            borderRadius: "8px",
            background: "#111a2c",
            border: "1px solid #24324d",
            color: "white",
            fontSize: "13px",
          }}
        >

          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background:
                backendError
                  ? "#ef4444"
                  : "#4ade80",
            }}
          />

          Sensor Backend:

          <strong>

            {backendError
              ? "OFFLINE"
              : sensorData
              ? "ONLINE"
              : "CONNECTING..."}

          </strong>

        </div>


        {/* =====================================
            SENSOR CARDS
            ===================================== */}

        <SensorTabs
          sensorData={sensorData}
        />


        {/* =====================================
            SENSOR VIEWER
            ===================================== */}

        <SensorViewer
          sensorData={sensorData}
        />

      </div>

    </Layout>

  );
}


export default Sensors;