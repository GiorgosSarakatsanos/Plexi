// MarginSettings.ts

export const marginSettings = {
  topMargin: 35,
  rightMargin: 24,
  bottomMargin: 24,
  leftMargin: 24,
  marginColor: "red", // Line color
  lineStyle: "solid" as "solid" | "dashed" | "dotted", // Strictly typed line style
  dashPattern: [5, 5], // Dash pattern for dashed/dotted lines
  opacity: 1, // Line opacity (0 to 1)
};

export const setMarginSettings = (
  top: number,
  right: number,
  bottom: number,
  left: number,
  color: string,
  lineStyle: "solid" | "dashed" | "dotted", // Ensure lineStyle is typed correctly
  dashPattern: number[],
  opacity: number
) => {
  marginSettings.topMargin = top;
  marginSettings.rightMargin = right;
  marginSettings.bottomMargin = bottom;
  marginSettings.leftMargin = left;
  marginSettings.marginColor = color;
  marginSettings.lineStyle = lineStyle; // Assign the typed lineStyle
  marginSettings.dashPattern = dashPattern;
  marginSettings.opacity = opacity;
};
