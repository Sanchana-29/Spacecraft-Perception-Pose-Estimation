import "./PosePipeline.css";

import {
  FaProjectDiagram,
  FaCrosshairs,
  FaCube,
  FaLocationArrow,
} from "react-icons/fa";

function PosePipeline() {

  const pipeline = [

    {
      name: "Feature Matching",
      icon: <FaProjectDiagram />,
    },

    {
      name: "SolvePnP",
      icon: <FaCrosshairs />,
    },

    {
      name: "Pose Refinement",
      icon: <FaCube />,
    },

    {
      name: "Relative Pose",
      icon: <FaLocationArrow />,
    },

  ];

  return (

    <div className="pose-pipeline">

      <h3>Pose Pipeline</h3>

      <div className="pipeline-list">

        {pipeline.map((step, index) => (

          <div key={index}>

            <div className="pipeline-card">

              <div className="pipeline-icon">
                {step.icon}
              </div>

              <span>{step.name}</span>

            </div>

            {index !== pipeline.length - 1 && (

              <div className="pipeline-arrow">
                ↓
              </div>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}

export default PosePipeline;