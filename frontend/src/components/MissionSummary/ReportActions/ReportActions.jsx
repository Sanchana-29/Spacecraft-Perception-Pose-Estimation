import "./ReportActions.css";

import {
  FaFilePdf,
  FaFileCsv,
  FaSave,
  FaDownload,
} from "react-icons/fa";

function ReportActions() {
  return (

    <div className="report-actions">

      <h2>Report Actions</h2>

      <div className="actions-grid">

        <button className="action-btn">

          <FaFilePdf />

          Export PDF

        </button>

        <button className="action-btn">

          <FaFileCsv />

          Export CSV

        </button>

        <button className="action-btn">

          <FaSave />

          Save Report

        </button>

        <button className="action-btn">

          <FaDownload />

          Download Logs

        </button>

      </div>

    </div>

  );
}

export default ReportActions;