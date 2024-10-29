export const StatebarButtons = [
  { id: "design", label: "Design", iconName: "Create" },
  { id: "edit", label: "Edit", iconName: "Pencil Drawing" },
  { id: "print", label: "Print", iconName: "Bursts" },
  { id: "share", label: "Share", iconName: "Share Rounded" },
  // Add more buttons as needed
];

export const ToolbarButtons = [
  {
    id: "select",
    label: "Select",
    iconName: "Cursor",
    dropdownItems: [],
    shapeType: "select",
  },
  {
    id: "move",
    label: "Move",
    iconName: "Move",
    dropdownItems: [],
    shapeType: "move",
  },
  {
    id: "rectangle",
    label: "Rectangle",
    iconName: "Rectangular",
    shapeType: "rect",
    dropdownItems: [
      {
        id: "circle",
        label: "Circle",
        iconName: "Circle",
        shapeType: "circle",
      },
      { id: "line", label: "Line", iconName: "Line", shapeType: "line" },
    ],
  },
  {
    id: "ellipse",
    label: "Ellipse",
    iconName: "Circle",
    shapeType: "ellipse",
    dropdownItems: [],
  },
  {
    id: "triangle",
    label: "Triangle",
    iconName: "Triangle",
    dropdownItems: [],
    shapeType: "triangle",
  },
  {
    id: "line",
    label: "Line",
    iconName: "Line",
    dropdownItems: [],
    shapeType: "line",
  },
  {
    id: "text",
    label: "Text",
    iconName: "Typography",
    dropdownItems: [],
    shapeType: "text",
  },
];
