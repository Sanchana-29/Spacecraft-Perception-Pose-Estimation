import Layout from "../components/Layout/Layout";
import "./MissionSummary.css";

import MissionOverview from "../components/MissionSummary/MissionOverview/MissionOverview";
import MissionStatistics from "../components/MissionSummary/MissionStatistics/MissionStatistics";
import MissionTimeline from "../components/MissionSummary/MissionTimeline/MissionTimeline";
import TargetSummary from "../components/MissionSummary/TargetSummary/TargetSummary";
import ReportActions from "../components/MissionSummary/ReportActions/ReportActions";

function MissionSummary() {
  return (
    <Layout
      showInspector={false}
      showFooter={false}
    >
      <div className="mission-page">

        <MissionOverview />

        <MissionStatistics />

        <MissionTimeline />

        <TargetSummary />

        <ReportActions />

      </div>
    </Layout>
  );
}

export default MissionSummary;