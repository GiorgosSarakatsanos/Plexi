// hooks/useFourSidedInput.ts
import { useState } from "react";

interface FourSidedInputValues {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

interface UseFourSidedInputProps {
  defaultValue: string;
}

export const useFourSidedInput = ({ defaultValue }: UseFourSidedInputProps) => {
  const [values, setValues] = useState<FourSidedInputValues>({
    top: defaultValue,
    right: defaultValue,
    bottom: defaultValue,
    left: defaultValue,
  });

  const updateAllSides = (value: string) => {
    setValues({
      top: value,
      right: value,
      bottom: value,
      left: value,
    });
  };

  const updateIndividualSide = (
    side: keyof FourSidedInputValues,
    value: string
  ) => {
    setValues((prevValues) => ({
      ...prevValues,
      [side]: value,
    }));
  };

  return { values, updateAllSides, updateIndividualSide };
};
