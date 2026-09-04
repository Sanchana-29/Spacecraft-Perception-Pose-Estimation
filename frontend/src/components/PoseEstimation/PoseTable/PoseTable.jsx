import "./PoseTable.css";

function PoseTable() {
  return (
    <div className="pose-table">

      <div className="pose-tabs">

        <button className="active">
          Pose Matrix
        </button>

        <button>
          Euler Angles
        </button>

        <button>
          Quaternion
        </button>

        <button>
          Relative State
        </button>

      </div>

      <div className="pose-content">

        <table>

          <tbody>

            <tr>
              <td>R11</td>
              <td>--</td>
              <td>R12</td>
              <td>--</td>
              <td>R13</td>
              <td>--</td>
            </tr>

            <tr>
              <td>R21</td>
              <td>--</td>
              <td>R22</td>
              <td>--</td>
              <td>R23</td>
              <td>--</td>
            </tr>

            <tr>
              <td>R31</td>
              <td>--</td>
              <td>R32</td>
              <td>--</td>
              <td>R33</td>
              <td>--</td>
            </tr>

            <tr>
              <td>Tx</td>
              <td>--</td>
              <td>Ty</td>
              <td>--</td>
              <td>Tz</td>
              <td>--</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default PoseTable;