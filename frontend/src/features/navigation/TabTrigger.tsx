import React from "react";
import { Tabs } from "@chakra-ui/react";

const TabTrigger: React.FC<{
  value: string;
  icon: React.ReactElement;
  label: string;
}> = ({ value, icon, label }) => (
  <Tabs.Trigger
    value={value}
    h={"43px"}
    flex={1}
    p={0}
    display="flex"
    alignItems="center"
    justifyContent="center"
    fontSize={"xs"}
  >
    {icon} {label}
  </Tabs.Trigger>
);

export default TabTrigger;
