import Layout from "../components/Layout/Layout";
import "./Settings.css";

import CameraSettings from "../components/Settings/CameraSettings/CameraSettings";
import AISettings from "../components/Settings/AISettings/AISettings";
import SimulationSettings from "../components/Settings/SimulationSettings/SimulationSettings";
import DisplaySettings from "../components/Settings/DisplaySettings/DisplaySettings";
import SettingsActions from "../components/Settings/SettingsActions/SettingsActions";

function Settings() {
  return (
    <Layout
      showInspector={false}
      showFooter={false}
    >
      <div className="settings-page">

        <div className="settings-grid">

          <CameraSettings />

          <AISettings />

          <SimulationSettings />

          <DisplaySettings />

        </div>

        <SettingsActions />

      </div>
    </Layout>
  );
}

export default Settings;