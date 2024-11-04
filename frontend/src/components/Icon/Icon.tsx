import React from "react";
import "./Icon.css";

interface IconProps {
  name: string;
  alt?: string;
  size?: "normal" | "small"; // Add size prop
}

const Icon: React.FC<IconProps> = ({ name, alt = "", size = "normal" }) => {
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

  return (
    <img
      src={SvgIcon}
      alt={alt}
      className={size === "small" ? "small-icon" : "normal-icon"}
    />
  );
};

export default Icon;
