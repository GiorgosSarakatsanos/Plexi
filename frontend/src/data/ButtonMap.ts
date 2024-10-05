// src/data/buttonData.ts
export const StatebarButtons = [
  { id: 1, label: "Design", iconName: "Create" },
  { id: 2, label: "Edit", iconName: "Pencil Drawing" },
  { id: 3, label: "Print", iconName: "Bursts" },
  { id: 4, label: "Share", iconName: "Share Rounded" },
  // Add more buttons as needed
];

export const ToolbarButtons = [
  {
    id: 1,
    label: "Brush",
    iconName: "Paintbrush",
    dropdownItems: [],
  },
  {
    id: 2,
    label: "Text",
    iconName: "Typography",
    dropdownItems: [],
  },
  {
    id: 3,
    label: "Rectangle",
    iconName: "Rectangular",
    dropdownItems: [
      { label: "Circle", iconName: "Circle" },
      { label: "Line", iconName: "Line" },
    ],
  },
  {
    id: 4,
    label: "Holder",
    iconName: "Hashtag",
    dropdownItems: [],
  },
  {
    id: 5,
    label: "Image",
    iconName: "Picture",
    dropdownItems: [],
  },
];
