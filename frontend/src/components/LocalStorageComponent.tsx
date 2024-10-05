import React, { useState, useEffect } from 'react';

const LocalStorageComponent: React.FC = () => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const savedValue = localStorage.getItem('designData');
    if (savedValue) {
      setValue(savedValue);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('designData', value);
    alert('Data saved to local storage!');
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter design data"
      />
      <button onClick={handleSave}>Save to Local Storage</button>
    </div>
  );
};

export default LocalStorageComponent;
