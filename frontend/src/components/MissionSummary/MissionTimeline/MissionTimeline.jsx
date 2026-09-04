import "./MissionTimeline.css";

import {
  FaPlayCircle,
  FaCamera,
  FaBullseye,
  FaCube,
  FaFlagCheckered,
} from "react-icons/fa";

function MissionTimeline() {

  const events = [

    {
      title: "Mission Started",
      icon: <FaPlayCircle />,
      time: "00:00:00",
    },

    {
      title: "Detection Started",
      icon: <FaCamera />,
      time: "--:--:--",
    },

    {
      title: "Target Selected",
      icon: <FaBullseye />,
      time: "--:--:--",
    },

    {
      title: "Pose Estimated",
      icon: <FaCube />,
      time: "--:--:--",
    },

    {
      title: "Mission Completed",
      icon: <FaFlagCheckered />,
      time: "--:--:--",
    },

  ];

  return (

    <div className="mission-timeline">

      <h2>Mission Timeline</h2>

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