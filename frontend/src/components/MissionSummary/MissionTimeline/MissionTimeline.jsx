import "./MissionTimeline.css";

import {
  FaPlayCircle,
  FaCamera,
  FaBullseye,
  FaCube,
  FaFlagCheckered,
  FaCheckCircle,
} from "react-icons/fa";

function MissionTimeline() {

  const events = [

    {
      title: "Target detection acquired",
      icon: <FaCamera />,
      time: "T+120.2 s",
    },

    {
      title: "Target tracking initiated",
      icon: <FaBullseye />,
      time: "T+126.8 s",
    },

    {
      title: "Pose estimation module ready",
      icon: <FaCube />,
      time: "T+135.4 s",
    },

    {
      title: "Telemetry update received",
      icon: <FaCheckCircle />,
      time: "T+145.6 s",
    },

  ];

  return (

    <div className="mission-timeline">

      <h2>Mission Events</h2>

      <div className="timeline">

        {events.map((event,index)=>(

          <div key={index}>

            <div className="timeline-card">

              <div className="timeline-icon">
                {event.icon}
              </div>

              <div className="timeline-info">

                <h3>{event.title}</h3>

                <span>{event.time}</span>

              </div>

            </div>

            {index !== events.length-1 && (

              <div className="timeline-line"></div>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}

export default MissionTimeline;