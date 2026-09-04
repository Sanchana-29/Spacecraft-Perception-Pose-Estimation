import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import { WindowProvider } from "./context/WindowContext";
import { SensorProvider } from "./context/SensorContext";
import { SimulationProvider } from "./context/SimulationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WindowProvider>
      <SensorProvider>
        <SimulationProvider>
          <App />
        </SimulationProvider>
      </SensorProvider>
    </WindowProvider>
  </React.StrictMode>
);