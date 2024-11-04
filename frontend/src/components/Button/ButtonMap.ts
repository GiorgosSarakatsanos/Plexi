interface TooltipSide {
  id: string;
  label: string;
  iconName: string;
  tooltipPosition: "top" | "bottom" | "left" | "right";
  shapeType?: string; // Optional for buttons that need a shapeType
}

export const StatebarButtons: TooltipSide[] = [
  {
    id: "canvas",
    label: "Canvas",
    iconName: "Create",
    tooltipPosition: "right",
  },
  {
    id: "layers",
    label: "Layers",
    iconName: "Pencil Drawing",
    tooltipPosition: "right",
  },
  {
    id: "create",
    label: "Create",
    iconName: "Create",
    tooltipPosition: "right",
  },
  {
    id: "browse",
    label: "Browse",
    iconName: "Create",
    tooltipPosition: "right",
  },
  {
    id: "print",
    label: "Print",
    iconName: "Bursts",
    tooltipPosition: "right",
  },
  {
    id: "share",
    label: "Share",
    iconName: "Share Rounded",
    tooltipPosition: "right",
  },
];

export const ToolbarButtons: TooltipSide[] = [
  {
    id: "select",
    label: "Select",
    iconName: "Cursor",
    shapeType: "select",
    tooltipPosition: "bottom",
  },
  {
    id: "rectangle",
    label: "Rectangle",
    iconName: "Rectangular",
    shapeType: "rect",
    tooltipPosition: "bottom",
  },
  {
    id: "ellipse",
    label: "Ellipse",
    iconName: "Circle",
    shapeType: "ellipse",
    tooltipPosition: "bottom",
  },
  {
    id: "triangle",
    label: "Triangle",
    iconName: "Triangle",
    shapeType: "triangle",
    tooltipPosition: "bottom",
  },
  {
    id: "line",
    label: "Line",
    iconName: "Line",
    shapeType: "line",
    tooltipPosition: "bottom",
  },
  {
    id: "text",
    label: "Text",
    iconName: "Typography",
    shapeType: "text",
    tooltipPosition: "bottom",
  },
];
