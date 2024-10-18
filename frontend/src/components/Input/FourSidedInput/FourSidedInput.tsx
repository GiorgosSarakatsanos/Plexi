import React, { useRef, useState, useEffect } from "react";
import Input from "../Input";
import Button from "../../Button/Button";
import Icon from "../../Icon/Icon";
import { useFourSidedInput } from "./useFourSidedInput";
import "./FourSidedInput.css";

interface FourSidedInputProps {
  label: string;
  unit?: string;
  defaultValue: string;
  topLabel: string;
  rightLabel: string;
  bottomLabel: string;
  leftLabel: string;
  topIconName?: string;
  rightIconName?: string;
  bottomIconName?: string;
  leftIconName?: string;
  buttonIconName?: string;
  buttonTextWhenOpen?: string;
  buttonTextWhenClosed?: string;
  onValuesChange: (values: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  }) => void; // Function to notify when values change
}

const FourSidedInput: React.FC<FourSidedInputProps> = ({
  label,
  unit = "",
  defaultValue,
  topLabel,
  rightLabel,
  bottomLabel,
  leftLabel,
  topIconName,
  rightIconName,
  bottomIconName,
  leftIconName,
  buttonIconName,
  buttonTextWhenOpen = `Hide Individual ${label}`,
  buttonTextWhenClosed = `Set Individual ${label}`,
  onValuesChange,
}) => {
  const { values, updateAllSides, updateIndividualSide } = useFourSidedInput({
    defaultValue,
  });
  const [showIndividualInputs, setShowIndividualInputs] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleGenericValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateAllSides(value); // When typing in the general input, update all individual sides
  };

  const handleIndividualInputChange = (
    side: keyof typeof values,
    value: string
  ) => {
    updateIndividualSide(side, value);
  };

  const handleShowIndividualInputs = () => {
    setShowIndividualInputs(!showIndividualInputs);
  };

  // Use useEffect to notify the parent component whenever values change
  useEffect(() => {
    onValuesChange(values);
  }, [values, onValuesChange]);

  // Determine if all sides are the same
  const allSidesEqual =
    values.top === values.right &&
    values.right === values.bottom &&
    values.bottom === values.left;

  // If all sides are equal, display the general input value
  // Otherwise, display "Custom"
  const combinedValue = allSidesEqual
    ? values.top // Display top value (or any value, since they're the same)
    : `Custom (${values.top}, ${values.right}, ${values.bottom}, ${values.left})`;

  // Add event listener to close individual inputs when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowIndividualInputs(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  return (
    <div ref={containerRef} className="four-sided-input-container">
      <div className="generic-input">
        <label>
          {label} {unit}
        </label>
        <Input
          placeholder={`Set ${label} for all sides`}
          value={combinedValue} // Display "Custom" or combined value
          onChange={handleGenericValueChange} // Update all sides if changed
        />
      </div>

      <div className="show-sides-button">
        <Button
          label={
            showIndividualInputs ? buttonTextWhenOpen : buttonTextWhenClosed
          }
          onClick={handleShowIndividualInputs}
          iconName={buttonIconName}
        />
      </div>

      {showIndividualInputs && (
        <div className="individual-inputs">
          <div className="input-group">
            <label>{topLabel}</label>
            <Input
              placeholder={topLabel}
              value={values.top}
              onChange={(e) =>
                handleIndividualInputChange("top", e.target.value)
              }
              icon={topIconName ? <Icon name={topIconName} /> : null}
            />
          </div>
          <div className="input-group">
            <label>{rightLabel}</label>
            <Input
              placeholder={rightLabel}
              value={values.right}
              onChange={(e) =>
                handleIndividualInputChange("right", e.target.value)
              }
              icon={rightIconName ? <Icon name={rightIconName} /> : null}
            />
          </div>
          <div className="input-group">
            <label>{bottomLabel}</label>
            <Input
              placeholder={bottomLabel}
              value={values.bottom}
              onChange={(e) =>
                handleIndividualInputChange("bottom", e.target.value)
              }
              icon={bottomIconName ? <Icon name={bottomIconName} /> : null}
            />
          </div>
          <div className="input-group">
            <label>{leftLabel}</label>
            <Input
              placeholder={leftLabel}
              value={values.left}
              onChange={(e) =>
                handleIndividualInputChange("left", e.target.value)
              }
              icon={leftIconName ? <Icon name={leftIconName} /> : null}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FourSidedInput;
