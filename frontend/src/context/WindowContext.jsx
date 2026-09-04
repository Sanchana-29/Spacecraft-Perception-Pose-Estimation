import { createContext, useContext, useState } from "react";

const WindowContext = createContext();

export function WindowProvider({ children }) {
  const [showCamera, setShowCamera] = useState(false);

  return (
    <WindowContext.Provider
      value={{
        showCamera,
        setShowCamera,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindow() {
  return useContext(WindowContext);
}