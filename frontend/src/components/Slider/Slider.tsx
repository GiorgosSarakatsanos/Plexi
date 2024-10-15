import React from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  onChange,
}) => {
  const inputId = `${label.replace(/\s+/g, "-").toLowerCase()}-slider`;

  return (
    <div>
      <label htmlFor={inputId}>{label}: </label>
      <input
        type="range"
        id={inputId}
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        title={label} // Adds a title attribute for better accessibility
        aria-label={label} // Adds an aria-label attribute for screen readers
      />
      <span>{value}</span>
    </div>
  );
};

export default Slider;
