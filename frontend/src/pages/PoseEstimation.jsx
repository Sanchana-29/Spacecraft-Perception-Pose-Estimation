import Layout from "../components/Layout/Layout";
import "./PoseEstimation.css";

import PoseControls from "../components/PoseEstimation/PoseControls/PoseControls";
import PosePipeline from "../components/PoseEstimation/PosePipeline/PosePipeline";
import PoseViewer from "../components/PoseEstimation/PoseViewer/PoseViewer";
import PoseResults from "../components/PoseEstimation/PoseResults/PoseResults";
import PoseTable from "../components/PoseEstimation/PoseTable/PoseTable";

function PoseEstimation() {
  return (
    <Layout
      showInspector={false}
      showFooter={false}
    >
      <div className="pose-page">

        <PoseControls />

        <div className="pose-middle">
          <div className="pose-left-col">
            <PosePipeline />
            <PoseTable />
          </div>
          <PoseViewer />
          <div className="pose-right-col">
            <PoseResults />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PoseEstimation;