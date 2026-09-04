import "./DetectionTable.css";

function DetectionTable() {

  const detections = [];

  return (

    <div className="detection-table">

      <div className="table-header">

        <h3>Detected Objects</h3>

        <span>0 Objects</span>

      </div>

      <table>

        <thead>

          <tr>

            <th>ID</th>

            <th>Class</th>

            <th>Confidence</th>

            <th>Track ID</th>

            <th>Status</th>

            <th>Target</th>

          </tr>

        </thead>

        <tbody>

          {detections.length === 0 ? (

            <tr>

              <td colSpan="6" className="empty">

                No Objects Detected

              </td>

            </tr>

          ) : (

            detections.map((item) => (

              <tr key={item.id}>
                <td>{item.id}</td>
              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}

export default DetectionTable;