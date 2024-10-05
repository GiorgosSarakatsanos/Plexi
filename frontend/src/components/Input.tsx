import React, { ChangeEvent } from 'react';  // Import ChangeEvent from React
import '../styles/Input.css';  // Import corresponding CSS for styling

// Define the props for the Input component
interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;  // Explicitly define type for onChange
  icon?: React.ReactNode;  // Add icon prop
}

const Input: React.FC<InputProps> = ({ placeholder, value, onChange, icon }) => {
  return (
    <div className="input-container">
      {icon && <span className="input-icon">{icon}</span>}  {/* Render the icon if provided */}
      <input
        type="text"
        value={value}
        onChange={onChange}  // Pass the onChange event up to the handler
        placeholder={placeholder}
        className="custom-input"
      />
    </div>
  );
};

export default Input;
