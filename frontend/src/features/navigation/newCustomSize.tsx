import React, { useState } from "react";
import { Button, Fieldset, HStack, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/ui/field";
import { NativeSelectField, NativeSelectRoot } from "@/ui/native-select";

const NewCustomSize: React.FC<{
  onAdd: (dimension: string, description: string, unit: string) => void;
}> = ({ onAdd }) => {
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

  return (
    <Stack px={2}>
      <Fieldset.Root size="sm" fontSize={"xs"}>
        <Stack fontSize={"xs"}>
          <Fieldset.Legend>Create a new custom size</Fieldset.Legend>
        </Stack>

        <Fieldset.Content>
          <HStack>
            {/* Width Input */}
            <Field fontSize={"xs"} label="Width">
              <Input
                name="width"
                placeholder="Enter width"
                size={"2xs"}
                variant={"flushed"}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                required
              />
            </Field>

            {/* Height Input */}
            <Field fontSize={"xs"} label="Height">
              <Input
                name="height"
                placeholder="Enter height"
                size={"2xs"}
                variant={"flushed"}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </Field>
          </HStack>

          {/* Unit Selector */}
          <HStack>
            <Field fontSize={"xs"} label="Unit">
              <NativeSelectRoot size={"xs"}>
                <NativeSelectField
                  focusRing={"none"}
                  name="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  items={["px", "mm", "in"]} // Unit options
                />
              </NativeSelectRoot>
            </Field>

            {/* Name Input */}
            <Field fontSize={"xs"} label="Name">
              <Input
                name="name"
                placeholder="Enter name"
                size={"2xs"}
                variant={"flushed"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>
          </HStack>
        </Fieldset.Content>

        <HStack w={"full"} h={"25px"}>
          <Button size={"xs"} flex={1} onClick={handleSubmit}>
            Add
          </Button>
        </HStack>
      </Fieldset.Root>
    </Stack>
  );
};

export default NewCustomSize;
