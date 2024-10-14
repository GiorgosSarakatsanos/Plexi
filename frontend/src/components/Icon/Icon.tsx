// src/components/Icon.tsx
import React from "react";

interface IconProps {
  name: string;
  alt?: string;
}

const Icon: React.FC<IconProps> = ({ name, alt = "" }) => {
  const icons = import.meta.glob<{ default: string }>("../../assets/icons/*.svg", {
    eager: true,
  });

  // Retrieve the SVG based on the name prop
  const SvgIcon = icons[`../../assets/icons/${name}.svg`]?.default;

  if (!SvgIcon) {
    console.warn(`Icon "${name}" does not exist.`);
    return null; // Return null if the SVG is not found
  }

  return <img src={SvgIcon} alt={alt} className="icon" />;
};

export default Icon;
