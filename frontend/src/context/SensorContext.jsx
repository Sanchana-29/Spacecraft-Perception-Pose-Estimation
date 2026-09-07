import { createContext, useContext, useState } from "react";

const SensorContext = createContext();

const STORAGE_KEY = "spacecraft_captured_frame";

export function SensorProvider({ children }) {
  const [selectedSensor, setSelectedSensor] = useState("RGB-D Camera");

  const [capturedFrame, setCapturedFrameState] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setCapturedFrame = (frame) => {
    setCapturedFrameState(frame);
    try {
      if (frame) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(frame));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.warn("Could not save captured frame to sessionStorage:", err);
    }
  };

  return (
    <SensorContext.Provider
      value={{
        selectedSensor,
        setSelectedSensor,
        capturedFrame,
        setCapturedFrame,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
}

export function useSensor() {
  return useContext(SensorContext);
}