import "./SettingsActions.css";

import {
  FaSave,
  FaUndo,
  FaFileExport,
  FaFileImport,
} from "react-icons/fa";

function SettingsActions() {
  return (
    <div className="settings-actions">

      <button className="action-btn save">
        <FaSave />
        Save Settings
      </button>

      <button className="action-btn reset">
        <FaUndo />
        Reset Defaults
      </button>

      <button className="action-btn export">
        <FaFileExport />
        Export Config
      </button>

      <button className="action-btn import">
        <FaFileImport />
        Import Config
      </button>

    </div>
  );
}

export default SettingsActions;