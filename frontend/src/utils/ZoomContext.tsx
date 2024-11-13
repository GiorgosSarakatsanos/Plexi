import { createContext, useContext, useState, useEffect } from "react";

const ZoomContext = createContext(null);

export const ZoomProvider: React.FC = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 4.0));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.1));
  const setZoomToPercentage = (percentage) => setZoomLevel(percentage / 100);

  useEffect(() => {
    console.log("Zoom Level:", zoomLevel);
  }, [zoomLevel]);

  return (
    <ZoomContext.Provider
      value={{ zoomLevel, zoomIn, zoomOut, setZoomToPercentage }}
    >
      {children}
    </ZoomContext.Provider>
  );
};

export const useZoom = () => {
  const context = useContext(ZoomContext);
  if (!context) throw new Error("useZoom must be used within a ZoomProvider");
  return context;
};
