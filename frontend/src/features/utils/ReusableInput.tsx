import React from "react";
import { Box, Input } from "@chakra-ui/react";

interface ReusableInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  fontSize?: string;
  h?: number | string;
  size?: string;
  variant?: string;
  gridColumn?: string;
}

const ReusableInput: React.FC<ReusableInputProps> = ({
  name,
  value,
  onChange,
  required = false,
  fontSize = "xs",
  h = 3,
  gridColumn,
}) => {
  return (
    <Box gridColumn={gridColumn}>
      {/* Input Field */}
      <Input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        fontSize={fontSize}
        bg={"bg.subtle"}
        p={3}
        rounded={"md"}
        h={h}
        size="xs"
        variant="outline"
        focusRing={"none"}
      />
    </Box>
  );
};

export default ReusableInput;
