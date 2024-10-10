import React from "react";
import SizeSelector from "./components/SizeSelector";

const App: React.FC = () => {
  return (
    <div className="App">
      {/* Paper Size Selector */}
      <SizeSelector type="paperSize" onSizeSelect={() => {}} />

      {/* Image Size Selector */}
      <SizeSelector type="imageSize" onSizeSelect={() => {}} />
    </div>
  );
};

export default App;
