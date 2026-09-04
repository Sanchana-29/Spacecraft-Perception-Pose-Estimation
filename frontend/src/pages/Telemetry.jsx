import Layout from "../components/Layout/Layout";
import "./Telemetry.css";

import TelemetryControls from "../components/Telemetry/TelemetryControls/TelemetryControls";
import LiveMetrics from "../components/Telemetry/LiveMetrics/LiveMetrics";
import DistanceChart from "../components/Telemetry/DistanceChart/DistanceChart";
import VelocityChart from "../components/Telemetry/VelocityChart/VelocityChart";
import AttitudeChart from "../components/Telemetry/AttitudeChart/AttitudeChart";
import TelemetryLogs from "../components/Telemetry/TelemetryLogs/TelemetryLogs";

function Telemetry() {
  return (
    <Layout
      showInspector={false}
      showFooter={false}
    >
      <div className="telemetry-page">

        <TelemetryControls />

        <LiveMetrics />

        <DistanceChart />

        <VelocityChart />

        <AttitudeChart />

        <TelemetryLogs />

      </div>
    </Layout>
  );
}

export default Telemetry;