import React, { useState } from 'react';
import { useSettings } from '../data/SettingsContext';
import AddNewSizeForm from '../components/AddNewSizeForm';
import '../styles/Input.css';

const ImageSizeInput: React.FC = () => {
  const { imageSize, predefinedImageSizes, updateSetting } = useSettings();
  const [width, setWidth] = useState<string>(''); // Custom width input for image size
  const [height, setHeight] = useState<string>(''); // Custom height input for image size
  const [unit, setUnit] = useState<string>('mm'); // Default unit
  const [isCustom, setIsCustom] = useState<boolean>(false); // Toggle for custom input
  const [showForm, setShowForm] = useState<boolean>(false); // Show the add new size form
  const [newPredefinedSizes, setNewPredefinedSizes] = useState<string[]>(predefinedImageSizes); // Manage updated sizes

  // Parse the existing imageSize to extract width, height, and unit
  const parseImageSize = (size: string) => {
    const regex = /(\d+)\s*x\s*(\d+)\s*(mm|cm|inches|m)/;
    const match = size.match(regex);
    if (match) {
      const [, parsedWidth, parsedHeight, parsedUnit] = match;
      setWidth(parsedWidth);
      setHeight(parsedHeight);
      setUnit(parsedUnit);
    }
  };

  // Handle selection of predefined or custom image size
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustom(true);
      parseImageSize(imageSize); // Pre-fill inputs with current imageSize dimensions
    } else {
      setIsCustom(false);
      updateSetting('imageSize', value); // Use predefined imageSize
    }
  };

  // Handle new size submission and automatically select it in the dropdown
  const handleAddNewSize = (newSize: string) => {
    setNewPredefinedSizes([...newPredefinedSizes, newSize]); // Update the predefined list with the new size
    updateSetting('imageSize', newSize); // Automatically select the new size
    setIsCustom(false); // Return to the dropdown
    setShowForm(false); // Hide the form
  };

  // Handle "Enter" key for confirming custom size
  const handleConfirmCustomSize = () => {
    const customSize = `${width} x ${height} ${unit}`;
    updateSetting('imageSize', customSize); // Update the custom size

    const saveSize = window.confirm('Do you want to save this custom size?');
    if (saveSize) {
      setShowForm(true); // Show form to save custom size
    } else {
      setIsCustom(false); // Cancel custom input if the user doesn't want to save
    }
  };

  // Handle input changes
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(e.target.value); // Update width value
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(e.target.value); // Update height value
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUnit(e.target.value); // Update the unit
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleConfirmCustomSize(); // Only trigger on "Enter"
    } else if (e.key === 'Escape') {
      setIsCustom(false); // Cancel custom input on "Escape"
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <label>Image Size: </label>
      {!isCustom ? (
        <select value={imageSize} onChange={handleSelectChange}>
          {newPredefinedSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
      ) : (
        <div className="input-row">
          <input
            type="text"
            value={width}
            onChange={handleWidthChange}
            placeholder="Width"
            className="size-input"
          />
          <span className="separator">x</span>
          <input
            type="text"
            value={height}
            onChange={handleHeightChange}
            placeholder="Height"
            className="size-input"
          />
          <select value={unit} onChange={handleUnitChange} className="unit-dropdown">
            <option value="mm">mm</option>
            <option value="cm">cm</option>
            <option value="inches">inches</option>
            <option value="m">m</option>
          </select>
        </div>
      )}

      {showForm && (
        <AddNewSizeForm
          type="imageSize"
          initialWidth={width}
          initialHeight={height}
          initialUnit={unit}
          onAddNewSize={handleAddNewSize} // Pass callback to form
        />
      )}
    </div>
  );
};

export default ImageSizeInput;
