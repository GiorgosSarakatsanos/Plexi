import React, { useState } from "react";
import { Button, Fieldset, HStack, Stack, Text } from "@chakra-ui/react";
import { Field } from "@/ui/field";
import { NativeSelectField, NativeSelectRoot } from "@/ui/native-select";
import ReusableInput from "../utils/ReusableInput";

const NewCustomSize: React.FC<{
  onAdd: (dimension: string, description: string, unit: string) => void;
  onCancel: () => void; // Pass an `onCancel` callback from parent
}> = ({ onAdd, onCancel }) => {
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [unit, setUnit] = useState<string>("px"); // Default unit is pixels

  const handleSubmit = () => {
    if (width && height && name) {
      // Format the dimension string (e.g., "1080 x 1080 px")
      const dimension = `${width} x ${height} ${unit}`;

      // Pass the formatted custom size to the parent
      onAdd(dimension, name, unit);

      // Reset the input fields
      setWidth("");
      setHeight("");
      setName("");
      setUnit("px");
    }
  };

  const handleCancel = () => {
    // Reset fields
    setWidth("");
    setHeight("");
    setName("");
    setUnit("px");
    // Close the form
    onCancel();
  };

  return (
    <Stack>
      <Fieldset.Root size="sm" fontSize={"xs"}>

        <Fieldset.Content>
          <HStack>
            {/* Width Input */}
            <ReusableInput
              name="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />

            {/* Height Input */}
            <ReusableInput
              name="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </HStack>

          <HStack>
            {/* Unit Selector */}
            <Field>
              <HStack w={"full"}>
                <Text fontSize={"xs"} fontWeight="medium" color="gray.500">
                  U:
                </Text>
                <NativeSelectRoot size={"xs"} variant={"plain"}>
                  <NativeSelectField
                    focusRing={"none"}
                    h={5}
                    p={0}
                    name="unit"
                    fontSize={"xs"}
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    items={["pixels", "milimetres", "inches"]} // Unit options
                    color={"gray.500"}
                    borderBottom={"1px solid"}
                    borderColor={"gray.200"}
                    rounded={0}
                  />
                </NativeSelectRoot>
              </HStack>
            </Field>

            {/* Name Input */}
            <ReusableInput
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </HStack>
        </Fieldset.Content>

        <HStack w={"full"} h={2} py={4}>
          <Button size={"xs"} flex={1} onClick={handleSubmit}>
            Add
          </Button>
          <Button size={"xs"} flex={1} onClick={handleCancel} variant={"plain"}>
            Cancel
          </Button>
        </HStack>
      </Fieldset.Root>
    </Stack>
  );
};

export default NewCustomSize;
