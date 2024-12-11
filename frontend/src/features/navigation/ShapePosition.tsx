import { useState } from "react";
import {
  Grid,
  Text,
  Heading,
  Stack,
  IconButton,
  HStack,
  Box,
} from "@chakra-ui/react";
import {
  LuFlipHorizontal2,
  LuFlipVertical2,
  LuLink2Off,
  LuLink2,
} from "react-icons/lu";
import ReusableInput from "../utils/ReusableInput";

const ShapePosition = () => {
  const [isLocked, setIsLocked] = useState(true); // State to toggle icons

  const position = [
    { name: "X-position", value: "", onChange: () => {} },
    { name: "Y-position", value: "", onChange: () => {} },
  ];
  const dimensions = [
    { name: "Width", value: "", onChange: () => {} },
    { name: "Height", value: "", onChange: () => {} },
  ];

  return (
    <Stack gap={4}>
      <Heading fontSize="xs">Selection Properties</Heading>
      <Grid templateColumns="1fr 24px 60px 60px" gap={1}>
        {/* First row: Position */}
        <Text gridColumn="span 1" fontSize="2xs" alignSelf="center">
          X, Y
        </Text>
        <Box gridColumn="span 1" w="16px" h="16px" />
        {position.map(({ name, value, onChange }) => (
          <ReusableInput
            key={name}
            name={name}
            value={value}
            onChange={onChange}
          />
        ))}

        {/* Second row: Size */}
        <Text gridColumn="span 1" fontSize="2xs" alignSelf="center">
          W, H
        </Text>
        <IconButton
          size="2xs"
          variant="plain"
          gridColumn="span 1"
          aria-label={isLocked ? "Unlock dimensions" : "Lock dimensions"}
          onClick={() => setIsLocked((prev) => !prev)} // Toggle state
        >
          {isLocked ? <LuLink2Off /> : <LuLink2 />}{" "}
          {/* Conditionally render icon */}
        </IconButton>
        {dimensions.map(({ name, value, onChange }) => (
          <ReusableInput
            key={name}
            name={name}
            value={value}
            onChange={onChange}
          />
        ))}

        {/* Third row: Angle */}
        <Text gridColumn="span 1" fontSize="2xs" alignSelf="center">
          Angle
        </Text>
        <Box gridColumn="span 1" w="16px" h="16px" />
        <ReusableInput name="Angle" value="" onChange={() => {}} />
        <HStack gridColumn="span 1" gap={1}>
          <IconButton
            flex="1"
            size="2xs"
            variant="subtle"
            bg="bg.subtle"
            border="1px solid"
            borderColor="bg.emphasized"
            aria-label="Flip horizontally"
          >
            <LuFlipHorizontal2 />
          </IconButton>
          <IconButton
            flex="1"
            size="2xs"
            variant="subtle"
            bg="bg.subtle"
            border="1px solid"
            borderColor="bg.emphasized"
            aria-label="Flip vertically"
          >
            <LuFlipVertical2 />
          </IconButton>
        </HStack>
      </Grid>
    </Stack>
  );
};

export default ShapePosition;
