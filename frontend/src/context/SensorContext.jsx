import { createContext, useContext, useState } from "react";

const SensorContext = createContext();

export function SensorProvider({ children }) {
  const [selectedSensor, setSelectedSensor] =
    useState("RGB-D Camera");

  return (
    <SensorContext.Provider
      value={{
        selectedSensor,
        setSelectedSensor,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
}

export function useSensor() {
  return useContext(SensorContext);
}