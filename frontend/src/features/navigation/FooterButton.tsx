import React from "react";
import { Button, IconButton } from "@chakra-ui/react";
import { Tooltip } from "@/ui/tooltip";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/ui/popover";

const FooterButton: React.FC<{
  icon: React.ReactElement;
  tooltip?: string;
  popoverContent?: React.ReactNode;
}> = ({ icon, tooltip, popoverContent }) => {
  if (popoverContent) {
    return (
      <PopoverRoot positioning={{ placement: "top" }}>
        <PopoverTrigger asChild>
          <Button size="2xs" variant="ghost" justifyContent={"flex-start"}>
            {icon}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>{popoverContent}</PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    );
  }

  if (tooltip) {
    return (
      <Tooltip content={tooltip}>
        <IconButton
          px={2}
          size={"xs"}
          variant={"ghost"}
          justifyContent={"flex-end"}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  }

  return null;
};

export default FooterButton;
