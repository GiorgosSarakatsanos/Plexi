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
    label: "Line",
    iconName: "Line",
    dropdownItems: [],
    shapeType: "line",
  },
  {
    id: 2,
    label: "Text",
    iconName: "Typography",
    dropdownItems: [],
    shapeType: "text",
  },
  {
    id: 3,
    label: "Rectangle",
    iconName: "Rectangular",
    shapeType: "rect",
    dropdownItems: [
      { label: "Circle", iconName: "Circle", shapeType: "circle" }, // Adds circle
      { label: "Line", iconName: "Line", shapeType: "line" }, // Adds line
    ],
  },
  {
    id: 4,
    label: "Ellipse",
    iconName: "Circle",
    shapeType: "ellipse",
    dropdownItems: [],
  },
  {
    id: 5,
    label: "Triangle",
    iconName: "Picture",
    dropdownItems: [],
    shapeType: "triangle",
  },
];
