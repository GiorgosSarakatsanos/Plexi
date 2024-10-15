import React, { useState } from "react";
import Toolbar from "./components/Toolbar/Toolbar";
import Statebar from "./components/Statebar/Statebar";
import Canvas from "./components/Canvas/Canvas";
import BackgroundColorPicker from "./components/Canvas/CanvasBackground";
import SizeSelector from "./components/Input/SizeSelector";
import { useCanvasSize } from "./hooks/useCanvasSize";
import { useBackgroundColor } from "./hooks/useBackgroundColor";

import "./styles/App.css";

const App: React.FC = () => {
  const { canvasSize, onSizeSelect } = useCanvasSize(); // Using the custom hook for canvas size
  const { backgroundColor, handleColorChange } = useBackgroundColor(); // Using the custom hook for background color
  const [addBox, setAddBox] = useState(false); // This should be passed to Toolbar

  return (
    <div className="App">
      <div className="toolbar-container">
        <div className="canvas-setup">
          {/* Pass unit, width, and height to onSizeSelect */}
          <SizeSelector type="imageSize" onSizeSelect={onSizeSelect} />
          <BackgroundColorPicker onChangeColor={handleColorChange} />
        </div>
        <div className="toolbar-wrapper">
          {/* Pass setAddBox as a prop to Toolbar */}
          <Toolbar setAddBox={setAddBox} />
        </div>
        <div className="statebar">
          <Statebar />
        </div>
      </div>
      <div className="canvas-container">
        {/* Use the converted canvasSize here */}
        <Canvas
          width={canvasSize.width}
          height={canvasSize.height}
          backgroundColor={backgroundColor}
        />
        {addBox && <div>New Box</div>}
      </div>
    </div>
  );
};

export default App;
