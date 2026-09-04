import { NavLink } from "react-router-dom";

import {
  FaSatellite,
  FaTachometerAlt,
  FaCamera,
  FaEye,
  FaCube,
  FaChartLine,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";

import "./Sidebar.css";


function Sidebar({
  open,
  setOpen,
}) {


  const menuItems = [
    {
      path: "/dashboard",
      icon: <FaTachometerAlt />,
      label: "Dashboard",
    },

    {
      path: "/sensors",
      icon: <FaCamera />,
      label: "Sensors",
    },

    {
      path: "/detection",
      icon: <FaEye />,
      label: "Detection",
    },

    {
      path: "/pose-estimation",
      icon: <FaCube />,
      label: "Pose Estimation",
    },

    {
      path: "/telemetry",
      icon: <FaChartLine />,
      label: "Telemetry",
    },

    {
      path: "/mission-summary",
      icon: <FaFileAlt />,
      label: "Mission Summary",
    },

    {
      path: "/settings",
      icon: <FaCog />,
      label: "Settings",
    },
  ];


  return (

    <div
      className={`
        sidebar-container
        ${open ? "sidebar-open" : "sidebar-closed"}
      `}
    >

      {/* ==================================
          SPACETUG TOGGLE
          ================================== */}

      <button
        className="spacetug-toggle"
        onClick={() => setOpen(!open)}
        title={
          open
            ? "Close Navigation"
            : "Open Navigation"
        }
      >

        <FaSatellite size={28} />

        {open && (
          <span>SpaceTug</span>
        )}

      </button>


      {/* ==================================
          NAVIGATION
          ================================== */}

      {open && (

        <nav className="sidebar-nav">

          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
            >

              <span className="nav-icon">
                {item.icon}
              </span>

              <span className="nav-label">
                {item.label}
              </span>

            </NavLink>

          ))}

        </nav>

      )}

    </div>
  );
}


export default Sidebar;