import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Detection from "../pages/Detection";

import PoseEstimation from "../pages/PoseEstimation";
import Telemetry from "../pages/Telemetry";
import MissionSummary from "../pages/MissionSummary";
import Settings from "../pages/Settings";
import Sensors from "../pages/Sensors";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
      
        <Route path="/sensors" element={<Sensors />} />
   <Route path="/detection" element={<Detection />} />
       <Route
    path="/pose-estimation"
    element={<PoseEstimation />}
/>
        <Route path="/telemetry" element={<Telemetry />} />
        <Route path="/mission-summary" element={<MissionSummary />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;