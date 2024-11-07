// components/data/menuItems.ts

import React from "react";
import {
  LuScissors,
  LuCopy,
  LuClipboard,
  LuFileSearch,
  LuMessageSquare,
  LuShare,
} from "react-icons/lu";

export const horizontalMenuItems = [
  { label: "Cut", value: "cut", icon: React.createElement(LuScissors) },
  { label: "Copy", value: "copy", icon: React.createElement(LuCopy) },
  { label: "Paste", value: "paste", icon: React.createElement(LuClipboard) },
];

export const verticalMenuItems = [
  {
    label: "Look Up",
    value: "look-up",
    icon: React.createElement(LuFileSearch),
  },
  {
    label: "Translate",
    value: "translate",
    icon: React.createElement(LuMessageSquare),
  },
  { label: "Share", value: "share", icon: React.createElement(LuShare) },
];
