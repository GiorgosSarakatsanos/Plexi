// src/App.tsx
import React from "react";
import SizeSelector from "../context/SizeSelector";
import { sizeMap } from "../data/SizeMap";

const App: React.FC = () => {
  const handleSizeSelect = (size: string) => {
    console.log("Selected size:", size);
    // Implement any additional logic you need when a size is selected
  };

  return (
    <div>
      <h1>Select Sizes</h1>
      <div>
        <SizeSelector
          type="paperSize"
          predefinedSizes={sizeMap.paperSize}
          onSizeSelect={handleSizeSelect}
        />
      </div>
      <div>
        <SizeSelector
          type="imageSize"
          predefinedSizes={sizeMap.imageSize}
          onSizeSelect={handleSizeSelect}
        />
      </div>
      {/* You can add more SizeSelectors for other types if needed */}
    </div>
  );
};

export default App;
