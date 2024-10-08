import React, { useState } from "react";
import { useSettings } from "../data/SettingsContext";
import "../styles/AddNewSizeForm.css"; // Assuming you have a CSS file for styling

interface AddNewSizeFormProps {
  type: "pageSize" | "imageSize";
  initialWidth?: string;
  initialHeight?: string;
  initialUnit?: string;
  onAddNewSize: (newSize: string) => void; // Callback to notify the parent of new size
}

const AddNewSizeForm: React.FC<AddNewSizeFormProps> = ({
  type,
  initialWidth = "",
  initialHeight = "",
  initialUnit = "mm",
  onAddNewSize,
}) => {
  const { addNewSize } = useSettings();
  const [name, setName] = useState<string>(""); // Name for the new size
  const [width] = useState<string>(initialWidth); // Pre-fill width, hidden
  const [height] = useState<string>(initialHeight); // Pre-fill height, hidden
  const [unit] = useState<string>(initialUnit); // Pre-fill unit, hidden

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name && width && height) {
      const newSize = `${name} (${width} x ${height} ${unit})`;
      addNewSize(type, newSize, width, height, unit); // Add new size to predefined list
      onAddNewSize(newSize); // Notify the parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-size-form">
      <div className="form-row">
        <label>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Size Name"
          required
          maxLength={15} // Limit the custom name input to 15 characters
          className="name-input"
        />

        <button type="submit" className="ok-button">
          OK
        </button>
      </div>

      {/* Hidden inputs for width, height, and unit */}
      <input type="hidden" value={width} />
      <input type="hidden" value={height} />
      <input type="hidden" value={unit} />
    </form>
  );
};

export default AddNewSizeForm;
