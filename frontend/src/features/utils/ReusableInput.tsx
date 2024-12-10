import React from "react";
import { HStack, Input } from "@chakra-ui/react";

interface ReusableInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  fontSize?: string;
  h?: number | string;
  size?: string;
  variant?: string;
}

const ReusableInput: React.FC<ReusableInputProps> = ({
  name,
  value,
  onChange,
  required = false,
  fontSize = "xs",
  h = 3,
}) => {
  return (
    <HStack align="center" w="full">
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
      />
    </HStack>
  );
};

export default ReusableInput;
