import React, { useState, useEffect } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import Tooltip from "../Tooltip/Tooltip";
import { useFourSidedInput } from "./useFourSidedInput";

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
  }) => void;
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

  // Tooltip visibility states for each icon
  const [showTopTooltip, setShowTopTooltip] = useState(false);
  const [showRightTooltip, setShowRightTooltip] = useState(false);
  const [showBottomTooltip, setShowBottomTooltip] = useState(false);
  const [showLeftTooltip, setShowLeftTooltip] = useState(false);

  const handleIndividualInputChange = (
    side: keyof typeof values,
    value: string
  ) => {
    updateIndividualSide(side, value);
  };

  const handleShowIndividualInputs = () => {
    setShowIndividualInputs(!showIndividualInputs);
  };

  useEffect(() => {
    onValuesChange(values);
  }, [values, onValuesChange]);

  return (
    <div className="stack-container">
      <div className="inline-container">
        <div>
          <label className="small-icon round">
            {label} {unit}
          </label>
        </div>
        <div>
          <Input
            placeholder={`Set ${label} for all sides`}
            value={values.top} // Display top value or "Custom"
            onChange={(e) => updateAllSides(e.target.value)}
          />
        </div>

        <div>
          <Button
            className="round"
            label={
              showIndividualInputs ? buttonTextWhenOpen : buttonTextWhenClosed
            }
            onClick={handleShowIndividualInputs}
            iconName={buttonIconName}
            iconSize="small"
          />
        </div>
      </div>

      {showIndividualInputs && (
        <>
          <div className="inline-container">
            <div
              className="inline-container"
              onMouseEnter={() => setShowTopTooltip(true)}
              onMouseLeave={() => setShowTopTooltip(false)}
            >
              {topIconName && <Icon name={topIconName} size="small" />}
              <Input
                placeholder={topLabel}
                value={values.top}
                onChange={(e) =>
                  handleIndividualInputChange("top", e.target.value)
                }
              />
              {showTopTooltip && (
                <Tooltip
                  text={topLabel}
                  visible={showTopTooltip}
                  position="top"
                />
              )}
            </div>

            <div
              className="inline-container"
              onMouseEnter={() => setShowRightTooltip(true)}
              onMouseLeave={() => setShowRightTooltip(false)}
            >
              {rightIconName && <Icon name={rightIconName} size="small" />}
              <Input
                placeholder={rightLabel}
                value={values.right}
                onChange={(e) =>
                  handleIndividualInputChange("right", e.target.value)
                }
              />
              {showRightTooltip && (
                <Tooltip
                  text={rightLabel}
                  visible={showRightTooltip}
                  position="top"
                />
              )}
            </div>
          </div>

          <div className="inline-container">
            <div
              className="inline-container"
              onMouseEnter={() => setShowBottomTooltip(true)}
              onMouseLeave={() => setShowBottomTooltip(false)}
            >
              {bottomIconName && <Icon name={bottomIconName} size="small" />}
              <Input
                placeholder={bottomLabel}
                value={values.bottom}
                onChange={(e) =>
                  handleIndividualInputChange("bottom", e.target.value)
                }
              />
              {showBottomTooltip && (
                <Tooltip
                  text={bottomLabel}
                  visible={showBottomTooltip}
                  position="bottom"
                />
              )}
            </div>

            <div
              className="inline-container"
              onMouseEnter={() => setShowLeftTooltip(true)}
              onMouseLeave={() => setShowLeftTooltip(false)}
            >
              {leftIconName && <Icon name={leftIconName} size="small" />}
              <Input
                placeholder={leftLabel}
                value={values.left}
                onChange={(e) =>
                  handleIndividualInputChange("left", e.target.value)
                }
              />
              {showLeftTooltip && (
                <Tooltip
                  text={leftLabel}
                  visible={showLeftTooltip}
                  position="bottom"
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FourSidedInput;
