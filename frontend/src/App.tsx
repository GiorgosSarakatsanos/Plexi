import React, { useState } from "react";
import SizeSelector from "./components/SizeSelector";
import CanvasComponent from "./components/CanvasComponent";
import Toolbar from "./containers/Toolbar";
import Statebar from "./containers/Statebar";
import "./App.css";
import { handleSizeSelect } from "./data/canvasSetup";
import ColorPickerButton from "./components/ColorPickerButton";

const App: React.FC = () => {
  const [canvasWidth, setCanvasWidth] = useState<number>(800);
  const [canvasHeight, setCanvasHeight] = useState<number>(600);
  const [addBox, setAddBox] = useState<boolean>(false);
  const [canvasBackgroundColor, setCanvasBackgroundColor] =
    useState<string>("white");
  const [unit, setUnit] = useState<"mm" | "cm" | "inches" | "pixels">("pixels");

  // Handle size selection
 const onSizeSelect = (
   size: string,
   selectedUnit: "mm" | "cm" | "inches" | "pixels"
 ) => {
   const newSize = handleSizeSelect(size); // Get the new width and height
   if (newSize) {
     setCanvasWidth(newSize.width); // Update the canvas width
     setCanvasHeight(newSize.height); // Update the canvas height
   }
   setUnit(selectedUnit); // Update the selected unit
 };

  // Handle color change from ColorPickerButton
  const handleColorChange = (newColor: string) => {
    setCanvasBackgroundColor(newColor); // Update the canvas background color
  };

  return (
    <div className="App">
      <div className="toolbar-container">
        <div className="canvas-setup">
          <div>
            <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
          </div>
          <div className="toolbox-container">
            <ColorPickerButton onChangeColor={handleColorChange} />
          </div>
        </div>
        <div className="toolbar-wrapper">
          <div className="toolbar">
            <Toolbar setAddBox={setAddBox} />
          </div>
        </div>
        <div className="statebar">
          <Statebar />
        </div>
      </div>
      <div className="canvas-container">
        <CanvasComponent
          width={canvasWidth}
          height={canvasHeight}
          addBox={addBox}
          setAddBox={setAddBox}
          backgroundColor={canvasBackgroundColor}
          unit={unit} // Pass the selected unit to CanvasComponent
        />
      </div>
    </div>
  );
};

export default App;
