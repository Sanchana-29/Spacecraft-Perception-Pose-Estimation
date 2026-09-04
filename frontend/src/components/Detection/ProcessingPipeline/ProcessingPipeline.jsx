import "./ProcessingPipeline.css";
import {
  FaCamera,
  FaImage,
  FaSearch,
  FaCrosshairs,
  FaRoute,
  FaFingerprint,
} from "react-icons/fa";

function ProcessingPipeline() {
  const pipeline = [
    {
      name: "Image Acquisition",
      icon: <FaCamera />,
    },
    {
      name: "Preprocessing",
      icon: <FaImage />,
    },
    {
      name: "YOLO Detection",
      icon: <FaSearch />,
    },
    {
      name: "ByteTrack",
      icon: <FaRoute />,
    },
    {
      name: "Identification",
      icon: <FaFingerprint />,
    },
    {
      name: "Target Selection",
      icon: <FaCrosshairs />,
    },
  ];

  return (
    <div className="processing-pipeline">

      <h3>Processing Pipeline</h3>

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

export default ProcessingPipeline;