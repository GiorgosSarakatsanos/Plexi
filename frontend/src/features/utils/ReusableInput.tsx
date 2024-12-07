import React from "react";
import { HStack, Text, Input } from "@chakra-ui/react";

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
      {/* Static label with the first letter of the name capitalized */}
      <Text fontSize={fontSize} fontWeight="medium" color="gray.500">
        {name.charAt(0).toUpperCase()}:
      </Text>
      {/* Input Field */}
      <Input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        fontSize={fontSize}
        h={h}
        size="xs"
        variant="flushed"
      />
    </HStack>
  );
};

export default ReusableInput;
