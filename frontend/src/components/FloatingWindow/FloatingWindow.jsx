import "./FloatingWindow.css";
import { Rnd } from "react-rnd";
import {
  FaWindowMinimize,
  FaRegWindowRestore,
  FaTimes,
} from "react-icons/fa";

export default function FloatingWindow({
  title,
  icon,
  children,
}) {
  return (
    <Rnd
      default={{
        x: 300,
        y: 120,
        width: 420,
        height: 300,
      }}
      minWidth={320}
      minHeight={180}
      bounds="parent"
      dragHandleClassName="floating-header"
    >
      <div className="floating-window">

        <div className="floating-header">

          <div className="floating-title">
            <span className="floating-icon">
              {icon}
            </span>

            <span>{title}</span>
          </div>

          <div className="floating-actions">
            <button>
              <FaWindowMinimize />
            </button>

            <button>
              <FaRegWindowRestore />
            </button>

            <button>
              <FaTimes />
            </button>
          </div>

        </div>

        <div className="floating-content">
          {children}
        </div>

      </div>
    </Rnd>
  );
}