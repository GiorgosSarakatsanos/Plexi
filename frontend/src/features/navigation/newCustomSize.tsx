import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import ReusableInput from "../utils/ReusableInput";

const NewCustomSize: React.FC<{
  onAdd: (dimension: string, description: string, unit: string) => void;
  onCancel: () => void;
}> = ({ onAdd, onCancel }) => {
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [unit, setUnit] = useState<string>("px"); // Default unit is pixels

  const handleSubmit = () => {
    if (width && height && name) {
      const dimension = `${width} x ${height} ${unit}`;
      onAdd(dimension, name, unit);
      setWidth("");
      setHeight("");
      setName("");
      setUnit("px");
    }
  };

  const handleCancel = () => {
    setWidth("");
    setHeight("");
    setName("");
    setUnit("px");
    onCancel();
  };

  return (
    <Stack gap={4}>
      <Heading fontSize="xs">Define size and name</Heading>

      <Grid templateColumns="1fr 16px 60px 60px" gap={1}>
        {/* First Row: Width & Height */}
        <Text gridColumn="span 1" fontSize="2xs" alignSelf="center">
          W, H
        </Text>
        <Box gridColumn="span 1" />
        <ReusableInput
          name="Width"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
        <ReusableInput
          name="Height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        {/* Second Row: Name */}
        <Text gridColumn="span 1" fontSize="2xs" alignSelf="center">
          Name
        </Text>
        <Box gridColumn="span 1" />
        <ReusableInput
          name="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          gridColumn="span 2" // Span last two columns
        />

        {/* Third Row: Unit */}
        <Text gridColumn="span 1" fontSize="2xs" alignSelf="center">
          Unit
        </Text>
        <Box gridColumn="span 1" />
        <HStack gridColumn="span 2" gap={1}>
          <Button
            flex="1"
            size="2xs"
            fontSize={"2xs"}
            variant={unit === "px" ? "solid" : "subtle"}
            bg={unit === "px" ? "transparent" : "bg.subtle"}
            border="1px solid"
            borderColor={unit === "px" ? "blue.500" : "bg.emphasized"} // Change active border color
            color={unit === "px" ? "black" : "gray.500"} // Change active text color
            onClick={() => setUnit("px")}
          >
            px
          </Button>
          <Button
            flex="1"
            size="2xs"
            fontSize={"2xs"}
            variant={unit === "mm" ? "solid" : "subtle"}
            bg={unit === "mm" ? "transparent" : "bg.subtle"}
            border="1px solid"
            borderColor={unit === "mm" ? "blue.500" : "bg.emphasized"} // Change active border color
            color={unit === "mm" ? "black" : "gray.500"} // Change active text color
            onClick={() => setUnit("mm")}
          >
            mm
          </Button>
          <Button
            flex="1"
            size="2xs"
            fontSize={"2xs"}
            variant={unit === "in" ? "solid" : "subtle"}
            bg={unit === "in" ? "transparent" : "bg.subtle"}
            border="1px solid"
            borderColor={unit === "in" ? "blue.500" : "bg.emphasized"} // Change active border color
            color={unit === "in" ? "black" : "gray.500"} // Change active text color
            onClick={() => setUnit("in")}
          >
            in
          </Button>
        </HStack>

        {/* Fourth Row: Save/Cancel */}
        <Text gridColumn="span 1" fontSize="2xs" alignSelf="center">
          Save?
        </Text>
        <Box gridColumn="span 1" />
        <HStack gridColumn="span 2" gap={1}>
          <Button size="2xs" flex={1} onClick={handleSubmit}>
            Add
          </Button>
          <Button size="2xs" flex={1} onClick={handleCancel} variant="plain">
            Cancel
          </Button>
        </HStack>
      </Grid>
    </Stack>
  );
};

export default NewCustomSize;
