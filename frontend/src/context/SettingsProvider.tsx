import React, { useState } from 'react';
import { SettingsContext, SettingsContextType } from '../data/SettingsContext'; // Correct path

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState({
    pageSize: 'A4 (210mm x 297mm)',
    imageSize: '100px x 100px',
    predefinedPageSizes: ['A4 (210mm x 297mm)', 'A3 (297mm x 420mm)', 'Letter (216mm x 279mm)', 'Legal (216mm x 356mm)'],
    predefinedImageSizes: ['50px x 50px', '100px x 100px', '150px x 150px', '200px x 200px'],
  });

  const updateSetting = <K extends keyof SettingsContextType>(key: K, value: SettingsContextType[K]) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const addNewSize = (type: 'pageSize' | 'imageSize', name: string, width: string, height: string, unit: string) => {
    const newSize = `${name} (${width} x ${height} ${unit})`;

    if (type === 'pageSize') {
      setSettings((prevSettings) => ({
        ...prevSettings,
        predefinedPageSizes: [...prevSettings.predefinedPageSizes, newSize],
      }));
    } else if (type === 'imageSize') {
      setSettings((prevSettings) => ({
        ...prevSettings,
        predefinedImageSizes: [...prevSettings.predefinedImageSizes, newSize],
      }));
    }
  };

  return (
    <SettingsContext.Provider value={{ ...settings, updateSetting, addNewSize }}>
      {children}
    </SettingsContext.Provider>
  );
};
