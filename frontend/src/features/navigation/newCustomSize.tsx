import React, { useState, useRef } from "react";
import { Button, Fieldset, HStack, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/ui/field";
import { NativeSelectField, NativeSelectRoot } from "@/ui/native-select";
import { evaluateExpression } from "../design/helpers/calculationHelper";

const NewCustomSize = () => {
  const [width, setWidth] = useState<string>(""); // Store width input
  const [height, setHeight] = useState<string>(""); // Store height input

  const heightInputRef = useRef<HTMLInputElement>(null); // Ref for height input

  // Handler for input validation and calculation on Enter
  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    nextInputRef?: React.RefObject<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value;
      const result = evaluateExpression(value); // Use the helper function
      if (result !== "Error") {
        setValue(result);
        if (nextInputRef?.current) {
          nextInputRef.current.focus(); // Move focus to the next input
        }
      }
    }
  };

  // Allow only numbers and mathematical operators during typing
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value;
    if (/^[0-9+\-*/.()]*$/.test(value)) {
      setValue(value); // Update value if valid
    }
  };

  return (
    <Stack px={2}>
      <Fieldset.Root size="sm" fontSize={"xs"}>
        <Stack fontSize={"xs"}>
          <Fieldset.Legend fontSize={"xs"}>
            Create a new custom size
          </Fieldset.Legend>
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
                onChange={(e) => handleInputChange(e, setWidth)} // Allow only valid characters
                onKeyDown={(e) =>
                  handleInputKeyDown(e, setWidth, heightInputRef)
                } // Handle Enter key
                required
              />
            </Field>

            {/* Height Input */}
            <Field fontSize={"xs"} label="Height">
              <Input
                ref={heightInputRef}
                name="height"
                placeholder="Enter height"
                size={"2xs"}
                variant={"flushed"}
                value={height}
                onChange={(e) => handleInputChange(e, setHeight)} // Allow only valid characters
                onKeyDown={(e) => handleInputKeyDown(e, setHeight)} // Handle Enter key
                required
              />
            </Field>
          </HStack>

          <HStack>
            {/* Unit Selector */}
            <Field>
              <NativeSelectRoot size={"xs"}>
                <NativeSelectField
                  focusRing={"none"}
                  name="unit"
                  items={["Pixels", "Millimeters", "Inches"]}
                />
              </NativeSelectRoot>
            </Field>

            {/* Name Input */}
            <Field>
              <Input
                name="name"
                placeholder="Enter name"
                size={"2xs"}
                variant={"flushed"}
                required
              />
            </Field>
          </HStack>
        </Fieldset.Content>

        <HStack w={"full"} h={"25px"}>
          <Button type="submit" size={"xs"} flex={1}>
            Submit
          </Button>
          <Button type="button" size={"xs"} flex={1} variant={"plain"}>
            Cancel
          </Button>
        </HStack>
      </Fieldset.Root>
    </Stack>
  );
};

export default NewCustomSize;
