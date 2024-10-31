// src/components/Tooltip/Tooltip.tsx
import React from "react";
import "./TooltipStyle.css";

interface TooltipProps {
  text: string;
  visible: boolean;
  position: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({ text, visible, position }) => {
  return (
    <div className={`tooltip ${position} ${visible ? "visible" : ""}`}>
      <span className="tooltip-arrow"></span>
      {text}
    </div>
  );
};

export default Tooltip;
