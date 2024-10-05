import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, onChange }) => {
  return (
    <div>
      <label>{label}: </label>
      <input type="range" value={value} min={min} max={max} onChange={onChange} />
      <span>{value}</span>
    </div>
  );
};

export default Slider;
