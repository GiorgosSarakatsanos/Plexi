import React, { useState } from "react";
import SizeSelector from "./components/SizeSelector"; // Import SizeSelector
import CanvasComponent from "./components/CanvasComponent"; // Import CanvasComponent
import Toolbar from "./containers/Toolbar"; // Import Toolbar
import Statebar from "./containers/Statebar"; // Import Toolbar
import "./App.css"; // Import the CSS file
import { handleSizeSelect } from "./data/canvasSetup"; // Import logic for size selection

const App: React.FC = () => {
  const [canvasWidth, setCanvasWidth] = useState<number>(800); // Default width
  const [canvasHeight, setCanvasHeight] = useState<number>(600); // Default height
  const [addBox, setAddBox] = useState<boolean>(false); // State to trigger adding the box

  const onSizeSelect = (size: string) => {
    const newSize = handleSizeSelect(size); // Get the new width and height

    if (newSize) {
      setCanvasWidth(newSize.width); // Update the canvas width
      setCanvasHeight(newSize.height); // Update the canvas height
    }
  };

  return (
    <div className="App">
      <div className="toolbar-container">
        <div className="canvas-setup">
          {/* SizeSelector for selecting image size */}
          <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
        </div>
        <div className="toolbar-wrapper">
          <div className="toolbar">
            <Toolbar setAddBox={setAddBox} /> {/* Pass setAddBox to Toolbar */}
          </div>
        </div>
        <div className="statebar">
          <Statebar />
        </div>
      </div>
      <div className="canvas-container">
        {/* Render Canvas with dynamic width and height */}
        <CanvasComponent
          width={canvasWidth}
          height={canvasHeight}
          addBox={addBox}
          setAddBox={setAddBox}
        />
      </div>
    </div>
  );
};

export default App;
