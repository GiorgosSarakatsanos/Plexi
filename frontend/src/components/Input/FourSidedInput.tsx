import React, { useState, useRef, useEffect } from "react";
import Input from "./Input";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import "../styles/FourSidedInput.css";

// Define the prop types for FourSidedInput
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
}) => {
  const [genericValue, setGenericValue] = useState<string>(defaultValue);
  const [top, setTop] = useState<string>(defaultValue);
  const [right, setRight] = useState<string>(defaultValue);
  const [bottom, setBottom] = useState<string>(defaultValue);
  const [left, setLeft] = useState<string>(defaultValue);
  const [showIndividualInputs, setShowIndividualInputs] =
    useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleGenericValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGenericValue(value);
    setTop(value);
    setRight(value);
    setBottom(value);
    setLeft(value);
  };

  const handleIndividualInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value);
  };

  const handleShowIndividualInputs = () => {
    setShowIndividualInputs(!showIndividualInputs);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowIndividualInputs(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (top === right && right === bottom && bottom === left) {
      setGenericValue(top);
    } else {
      setGenericValue(`Custom (${top}, ${right}, ${bottom}, ${left})`);
    }
  }, [top, right, bottom, left]);

  return (
    <div ref={containerRef} className="four-sided-input-container">
      <div className="generic-input">
        <label>
          {label} {unit}
        </label>
        <Input
          placeholder={`Set ${label} for all sides`}
          value={genericValue}
          onChange={handleGenericValueChange}
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
              value={top}
              onChange={(e) =>
                handleIndividualInputChange(setTop, e.target.value)
              }
              icon={topIconName ? <Icon name={topIconName} /> : null}
            />
          </div>
          <div className="input-group">
            <label>{rightLabel}</label>
            <Input
              placeholder={rightLabel}
              value={right}
              onChange={(e) =>
                handleIndividualInputChange(setRight, e.target.value)
              }
              icon={rightIconName ? <Icon name={rightIconName} /> : null}
            />
          </div>
          <div className="input-group">
            <label>{bottomLabel}</label>
            <Input
              placeholder={bottomLabel}
              value={bottom}
              onChange={(e) =>
                handleIndividualInputChange(setBottom, e.target.value)
              }
              icon={bottomIconName ? <Icon name={bottomIconName} /> : null}
            />
          </div>
          <div className="input-group">
            <label>{leftLabel}</label>
            <Input
              placeholder={leftLabel}
              value={left}
              onChange={(e) =>
                handleIndividualInputChange(setLeft, e.target.value)
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
