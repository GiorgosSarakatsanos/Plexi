import React, { ChangeEvent } from "react";
import "./Input.css";

// Define the props for the Input component
interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  disabled?: boolean; // Add the disabled prop
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  icon,
  disabled = false, // Set default to false
}) => {
  return (
    <div className="input-container">
      {icon && <span className="input-icon">{icon}</span>}{" "}
      {/* Render the icon if provided */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="custom-input"
        disabled={disabled} // Apply the disabled prop
      />
    </div>
  );
};

export default Input;
