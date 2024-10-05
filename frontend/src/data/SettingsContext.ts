import { createContext, useContext } from 'react';

// Define the shape of your settings data
export interface SettingsContextType {
  pageSize: string;
  predefinedPageSizes: string[];
  imageSize: string;
  predefinedImageSizes: string[];
  updateSetting: <K extends keyof SettingsContextType>(key: K, value: SettingsContextType[K]) => void;
  addNewSize: (type: 'pageSize' | 'imageSize', name: string, width: string, height: string, unit: string) => void;
}

// Create the context
export const SettingsContext = createContext<SettingsContextType>({
  pageSize: 'A4 (210mm x 297mm)',
  predefinedPageSizes: ['A4 (210mm x 297mm)', 'A3 (297mm x 420mm)', 'Letter (216mm x 279mm)', 'Legal (216mm x 356mm)'],
  imageSize: '100px x 100px',
  predefinedImageSizes: ['50px x 50px', '100px x 100px', '150px x 150px', '200px x 200px'],
  updateSetting: () => {},
  addNewSize: () => {},
});

// Custom hook to use the settings context
export const useSettings = () => useContext(SettingsContext);
