import {
  Grid,
  Text,
  Heading,
  Stack,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import ReusableInput from "../utils/ReusableInput";
import { LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";

const ShapePosition = () => {
  const position = [
    { name: "X-position", value: "", onChange: () => {} },
    { name: "Y-position", value: "", onChange: () => {} },
  ];
  const dimensions = [
    { name: "Width", value: "", onChange: () => {} },
    { name: "Height", value: "", onChange: () => {} },
  ];
  const angle = [{ name: "Angle", value: "", onChange: () => {} }];

  return (
    <Stack gap={4}>
      <Heading fontSize={"xs"}>Selection Properties</Heading>
      <Grid templateColumns="1fr 1fr 1fr" gap={1}>
        {/* First row: Position */}
        <Text gridColumn="span 1" fontSize={"xs"} alignSelf="center">
          X, Y
        </Text>
        {position.map(({ name, value, onChange }) => (
          <ReusableInput
            key={name}
            name={name}
            value={value}
            onChange={onChange}
          />
        ))}
        {/* Second row: Size */}
        <Text gridColumn="span 1" fontSize={"xs"} alignSelf="center">
          W, H
        </Text>
        {dimensions.map(({ name, value, onChange }) => (
          <ReusableInput
            key={name}
            name={name}
            value={value}
            onChange={onChange}
          />
        ))}
        {/* Third row: Angle */}
        <Text gridColumn="span 1" fontSize={"xs"} alignSelf="center">
          Angle
        </Text>
        {angle.map(({ name, value, onChange }) => (
          <ReusableInput
            key={name}
            name={name}
            value={value}
            onChange={onChange}
          />
        ))}
        <HStack gridColumn="span 1" gap={1}>
          <IconButton
            flex="1"
            size="2xs"
            variant={"subtle"}
            bg={"bg.subtle"}
            border={"1px solid"}
            borderColor={"bg.emphasized"}
            aria-label="Flip horizontally"
          >
            <LuFlipHorizontal2 />
          </IconButton>
          <IconButton
            flex="1"
            size="2xs"
            variant={"subtle"}
            bg={"bg.subtle"}
            border={"1px solid"}
            borderColor={"bg.emphasized"}
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
