import "./ObjectInspector.css";
import { useSimulation } from "../../context/SimulationContext";

function ObjectInspector() {
  const { selectedObject } = useSimulation();

  return (
    <div className="object-inspector">

      <h2>Object Inspector</h2>

      <section>
        <h3>Object Information</h3>

        <div className="row">
          <span>Object ID</span>
          <span>{selectedObject?.id || "--"}</span>
        </div>

        <div className="row">
          <span>Object Name</span>
          <span>{selectedObject?.name || "--"}</span>
        </div>

        <div className="row">
          <span>Object Type</span>
          <span>{selectedObject?.type || "--"}</span>
        </div>

        <div className="row">
          <span>Status</span>
          <span>{selectedObject?.status || "--"}</span>
        </div>
      </section>

      <section>
        <h3>Relative State</h3>

        <div className="row">
          <span>Distance</span>
          <span>{selectedObject?.distance || "--"}</span>
        </div>

        <div className="row">
          <span>Velocity</span>
          <span>{selectedObject?.velocity || "--"}</span>
        </div>

        <div className="row">
          <span>Position</span>
          <span>
            {selectedObject
              ? `X: ${selectedObject.position.x}, Y: ${selectedObject.position.y}, Z: ${selectedObject.position.z}`
              : "--"}
          </span>
        </div>
      </section>

      <section>
        <h3>Attitude</h3>

        <div className="row">
          <span>Roll</span>
          <span>{selectedObject?.attitude.roll || "--"}</span>
        </div>

        <div className="row">
          <span>Pitch</span>
          <span>{selectedObject?.attitude.pitch || "--"}</span>
        </div>

        <div className="row">
          <span>Yaw</span>
          <span>{selectedObject?.attitude.yaw || "--"}</span>
        </div>
      </section>

      <section>
        <h3>Tracking</h3>

        <div className="row">
          <span>Tracking Status</span>
          <span>{selectedObject?.trackingStatus || "--"}</span>
        </div>

        <div className="row">
          <span>Confidence</span>
          <span>{selectedObject?.confidence || "--"}</span>
        </div>
      </section>

    </div>
  );
}

export default ObjectInspector;