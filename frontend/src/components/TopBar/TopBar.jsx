import { useEffect, useState } from "react";
import "./TopBar.css";

function TopBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const utc = time.toUTCString().split(" ")[4];

  const ist = time.toLocaleTimeString("en-IN", {
    hour12: false,
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className="topbar-container">
      <div className="project-title">
        🚀 Spacecraft Perception and Pose Estimation
      </div>

      <div className="time-section">
        <span>UTC : {utc}</span>
        <span>IST : {ist}</span>
      </div>
    </div>
  );
}

export default TopBar;