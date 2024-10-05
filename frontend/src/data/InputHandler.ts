import { useState } from 'react';

// Custom hook to handle input data
export const useInputHandler = () => {
  const [inputValue, setInputValue] = useState<string>('');

  // Function to handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Perform additional logic like validation or transformation here
    console.log(`Current input value: ${value}`);
  };

  // Return the value and handler to the UI component
  return {
    inputValue,
    handleInputChange,
  };
};
