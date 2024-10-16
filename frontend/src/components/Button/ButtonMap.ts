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
    iconName: "Paintbrush",
    dropdownItems: [],
    shapeType: "line", // Not a shape, Brush tool logic would be handled separately
  },
  {
    id: 2,
    label: "Text",
    iconName: "Typography",
    dropdownItems: [],
    shapeType: "i-text", // Shape type corresponds to text (fabric.IText)
  },
  {
    id: 3,
    label: "Rectangle",
    iconName: "Rectangular",
    shapeType: "rectangle", // Adds rectangle to the canvas
    dropdownItems: [
      { label: "Circle", iconName: "Circle", shapeType: "circle" }, // Adds circle
      { label: "Line", iconName: "Line", shapeType: "line" }, // Adds line
    ],
  },
  {
    id: 4,
    label: "Ellipse",
    iconName: "Hashtag",
    shapeType: "circle",
    dropdownItems: [],
  },
  {
    id: 5,
    label: "Triangle",
    iconName: "Picture",
    dropdownItems: [],
    shapeType: "triangle",
  },
  {
    id: 6,
    label: "Polyline",
    iconName: "Picture",
    dropdownItems: [],
    shapeType: "polyline",
  },
];
