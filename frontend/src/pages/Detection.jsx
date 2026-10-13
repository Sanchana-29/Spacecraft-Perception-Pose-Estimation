import Layout from "../components/Layout/Layout";
import "./Detection.css";

import DetectionControls from "../components/Detection/DetectionControls/DetectionControls";
import ProcessingPipeline from "../components/Detection/ProcessingPipeline/ProcessingPipeline";
import DetectionViewer from "../components/Detection/DetectionViewer/DetectionViewer";
import DetectionStatistics from "../components/Detection/DetectionStatistics/DetectionStatistics";
import DetectionTable from "../components/Detection/DetectionTable/DetectionTable";

function Detection() {
  return (
    <Layout
      showInspector={false}
      showFooter={false}
    >
      <div className="detection-page">

        <DetectionControls />

        <div className="detection-middle">
          <div className="detection-left-col">
            <ProcessingPipeline />
            <DetectionTable />
          </div>
          <DetectionViewer />
          <div className="detection-right-col">
            <DetectionStatistics />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Detection;