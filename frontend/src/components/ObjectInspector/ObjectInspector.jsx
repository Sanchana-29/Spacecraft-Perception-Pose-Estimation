import "./ObjectInspector.css";
import { useSimulation } from "../../context/SimulationContext";

function ObjectInspector() {
  const { selectedObject, trackingTarget, isTracking, angularVelocity } = useSimulation();

  let wx = null;
  let wy = null;
  let wz = null;
  let tumblingRateVal = "--";

  if (selectedObject?.id === "SAT-001") {
    wx = Number(angularVelocity?.x ?? selectedObject?.angularVelocity?.x ?? 0);
    wy = Number(angularVelocity?.y ?? selectedObject?.angularVelocity?.y ?? 0);
    wz = Number(angularVelocity?.z ?? selectedObject?.angularVelocity?.z ?? 0);
  } else if (selectedObject?.angularVelocity) {
    wx = Number(selectedObject.angularVelocity.x) || 0;
    wy = Number(selectedObject.angularVelocity.y) || 0;
    wz = Number(selectedObject.angularVelocity.z) || 0;
  } else if (selectedObject?.id === "CHS-001") {
    wx = 0;
    wy = 0;
    wz = 0;
  }

  if (wx !== null && wy !== null && wz !== null) {
    const rate = Math.sqrt(wx * wx + wy * wy + wz * wz);
    tumblingRateVal = `${rate.toFixed(4)} rad/s`;
  }

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
          <span>{selectedObject?.attitude?.roll || "--"}</span>
        </div>

        <div className="row">
          <span>Pitch</span>
          <span>{selectedObject?.attitude?.pitch || "--"}</span>
        </div>

        <div className="row">
          <span>Yaw</span>
          <span>{selectedObject?.attitude?.yaw || "--"}</span>
        </div>
      </section>

      <section>
        <h3>Rotational Dynamics</h3>

        <div className="row">
          <span>Ang. Vel. X</span>
          <span>{wx !== null ? `${wx.toFixed(4)} rad/s` : "--"}</span>
        </div>

        <div className="row">
          <span>Ang. Vel. Y</span>
          <span>{wy !== null ? `${wy.toFixed(4)} rad/s` : "--"}</span>
        </div>

        <div className="row">
          <span>Ang. Vel. Z</span>
          <span>{wz !== null ? `${wz.toFixed(4)} rad/s` : "--"}</span>
        </div>

        <div className="row">
          <span>Tumbling Rate</span>
          <span>{tumblingRateVal}</span>
        </div>
      </section>



    </div>
  );
}

export default ObjectInspector;