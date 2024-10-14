interface SizeInputProps {
  width: string;
  height: string;
  unit: string;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  units: string[];
  widthRef?: React.RefObject<HTMLInputElement>; // Accept widthRef as an optional prop
}

const SizeInputComponent: React.FC<SizeInputProps> = ({
  width,
  height,
  unit,
  onWidthChange,
  onHeightChange,
  onUnitChange,
  units,
  widthRef,
}) => {
  const evaluateExpression = (expression: string): string => {
    try {
      // Safely evaluate the expression and return the result
      // The eval function is dangerous, so we'll use a safer way using new Function
      const result = new Function("return " + expression)();
      if (isNaN(result)) throw new Error("Invalid expression");
      return result.toString(); // Return the result as a string to store in state
    } catch (error) {
      console.error("Invalid expression:", error);
      return expression; // Return the original expression if invalid
    }
  };

  return (
    <div className="input-row">
      <input
        ref={widthRef} // Attach the ref to the width input
        type="text" // Allow text input for mathematical expressions
        value={width}
        onChange={(e) => onWidthChange(e.target.value)} // Store the raw input
        onBlur={() => onWidthChange(evaluateExpression(width))} // Evaluate the expression on blur (when focus leaves the input)
        placeholder="Width"
        className="size-input"
      />
      <span className="separator">x</span>
      <input
        type="text" // Allow text input for mathematical expressions
        value={height}
        onChange={(e) => onHeightChange(e.target.value)} // Store the raw input
        onBlur={() => onHeightChange(evaluateExpression(height))} // Evaluate the expression on blur
        placeholder="Height"
        className="size-input"
      />
      <select
        value={unit}
        onChange={(e) => onUnitChange(e.target.value)}
        className="unit-dropdown"
      >
        {units.map((unitOption) => (
          <option key={unitOption} value={unitOption}>
            {unitOption}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SizeInputComponent;
