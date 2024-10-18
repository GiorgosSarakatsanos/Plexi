// MarginSettings.ts

export const marginSettings = {
  topMargin: 35,
  rightMargin: 24,
  bottomMargin: 24,
  leftMargin: 24,
  marginColor: "red",
};

export const setMarginSettings = (
  top: number,
  right: number,
  bottom: number,
  left: number
) => {
  marginSettings.topMargin = top;
  marginSettings.rightMargin = right;
  marginSettings.bottomMargin = bottom;
  marginSettings.leftMargin = left;
};
