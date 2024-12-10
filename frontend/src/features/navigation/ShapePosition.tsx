import { Fieldset, Grid } from "@chakra-ui/react";
import ReusableInput from "../utils/ReusableInput";

const ShapePosition = () => {
  const inputs = [
    { name: "X-position", value: "", onChange: () => {} },
    { name: "Y-position", value: "", onChange: () => {} },
    { name: "Width", value: "", onChange: () => {} },
    { name: "Height", value: "", onChange: () => {} },
  ];

  return (
    <Fieldset.Root>
      <Fieldset.Legend>Position</Fieldset.Legend>
      <Fieldset.Content>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          {inputs.map(({ name, value, onChange }) => (
            <ReusableInput
              key={name}
              name={name}
              value={value}
              onChange={onChange}
            />
          ))}
        </Grid>
      </Fieldset.Content>
    </Fieldset.Root>
  );
};

export default ShapePosition;
