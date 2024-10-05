import React, { useState } from 'react';
import { useSettings } from '../data/SettingsContext';
import AddNewSizeForm from '../components/AddNewSizeForm';
import '../styles/Input.css';

const PageSizeInput: React.FC = () => {
  const { pageSize, predefinedPageSizes, updateSetting } = useSettings();
  const [width, setWidth] = useState<string>(''); // Custom width input
  const [height, setHeight] = useState<string>(''); // Custom height input
  const [unit, setUnit] = useState<string>('mm'); // Default unit
  const [isCustom, setIsCustom] = useState<boolean>(false); // Toggle for custom input
  const [showForm, setShowForm] = useState<boolean>(false); // Show the add new size form
  const [newPredefinedSizes, setNewPredefinedSizes] = useState<string[]>(predefinedPageSizes); // Manage updated sizes

  // Parse the existing pageSize to extract width, height, and unit
  const parsePageSize = (size: string) => {
    const regex = /(\d+)\s*x\s*(\d+)\s*(mm|cm|inches|m)/;
    const match = size.match(regex);
    if (match) {
      const [, parsedWidth, parsedHeight, parsedUnit] = match;
      setWidth(parsedWidth);
      setHeight(parsedHeight);
      setUnit(parsedUnit);
    }
  };

  // Handle selection of predefined or custom size
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustom(true);
      parsePageSize(pageSize); // Pre-fill inputs with current pageSize dimensions
    } else {
      setIsCustom(false);
      updateSetting('pageSize', value); // Use predefined pageSize
    }
  };

  // Handle new size submission and automatically select it in the dropdown
  const handleAddNewSize = (newSize: string) => {
    setNewPredefinedSizes([...newPredefinedSizes, newSize]); // Update the predefined list with the new size
    updateSetting('pageSize', newSize); // Automatically select the new size
    setIsCustom(false); // Return to the dropdown
    setShowForm(false); // Hide the form
  };

  // Handle "Enter" key for confirming custom size
  const handleConfirmCustomSize = () => {
    const customSize = `${width} x ${height} ${unit}`;
    updateSetting('pageSize', customSize); // Update the custom size

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
      <label>Page Size: </label>
      {!isCustom ? (
        <select value={pageSize} onChange={handleSelectChange}>
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
          type="pageSize"
          initialWidth={width}
          initialHeight={height}
          initialUnit={unit}
          onAddNewSize={handleAddNewSize} // Pass callback to form
        />
      )}
    </div>
  );
};

export default PageSizeInput;
