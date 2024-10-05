import React, { useState } from 'react';
import { useSettings } from '../data/SettingsContext';

interface AddNewSizeFormProps {
  type: 'pageSize' | 'imageSize';
  initialWidth?: string;
  initialHeight?: string;
  initialUnit?: string;
  onAddNewSize: (newSize: string) => void; // Callback to notify the parent of new size
}

const AddNewSizeForm: React.FC<AddNewSizeFormProps> = ({ type, initialWidth = '', initialHeight = '', initialUnit = 'mm', onAddNewSize }) => {
  const { addNewSize } = useSettings();
  const [name, setName] = useState<string>(''); // Name for the new size
  const [width, setWidth] = useState<string>(initialWidth); // Pre-fill width
  const [height, setHeight] = useState<string>(initialHeight); // Pre-fill height
  const [unit, setUnit] = useState<string>(initialUnit); // Pre-fill unit

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
      <div>
        <label>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Size Name"
          required
          maxLength={15} // Limit the custom name input to 15 characters
        />
        <p>{15 - name.length} characters left</p> {/* Feedback to user */}
      </div>
      <div>
        <label>Width: </label>
        <input
          type="text"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          placeholder="Width"
          required
        />
      </div>
      <div>
        <label>Height: </label>
        <input
          type="text"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height"
          required
        />
      </div>
      <div>
        <label>Unit: </label>
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="mm">mm</option>
          <option value="cm">cm</option>
          <option value="inches">inches</option>
          <option value="m">m</option>
        </select>
      </div>
      <button type="submit">Add New {type === 'pageSize' ? 'Page' : 'Image'} Size</button>
    </form>
  );
};

export default AddNewSizeForm;
