import React from "react";
import "./Icon.css";

interface IconProps {
  name: string;
  alt?: string;
}

const Icon: React.FC<IconProps> = ({ name, alt = "" }) => {
  const icons = import.meta.glob<{ default: string }>(
    "../../assets/icons/*.svg",
    {
      eager: true,
    }
  );

  const SvgIcon = icons[`../../assets/icons/${name}.svg`]?.default;

  if (!SvgIcon) {
    console.warn(`Icon "${name}" does not exist.`);
    return null;
  }

  return <img src={SvgIcon} alt={alt} className="icon" />;
};

export default Icon; // Ensure default export
