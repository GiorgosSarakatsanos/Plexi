interface SizeInputProps {
  width: string;
  height: string;
  unit: string;
  units: string[]; // Added units array
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onUnitChange: (value: string) => void;
}

const SizeInputComponent: React.FC<SizeInputProps> = ({
  width,
  height,
  unit,
  onWidthChange,
  onHeightChange,
  onUnitChange,
  units,
}) => {
  return (
    <div className="input-row">
      <input
        type="number"
        inputMode="numeric"
        value={width}
        onChange={(e) => onWidthChange(e.target.value)}
        placeholder="Width"
        className="size-input"
        min="5"
      />
      <span className="separator">x</span>
      <input
        type="number"
        inputMode="numeric"
        value={height}
        onChange={(e) => onHeightChange(e.target.value)}
        placeholder="Height"
        className="size-input"
        min="5"
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
