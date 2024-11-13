// Define a type for allowed units
export type UnitType = "mm" | "cm" | "in" | "px";

// Define a type for each size item
interface SizeItem {
  label: string;
  width: number;
  height: number;
  unit: UnitType;
}

// Define sizeMap with structured size items
export const sizeMap: {
  paperSize: {
    predefined: SizeItem[];
    units: UnitType[];
  };
  imageSize: {
    predefined: SizeItem[];
    units: UnitType[];
  };
} = {
  paperSize: {
    predefined: [
      { label: "A4", width: 210, height: 297, unit: "mm" },
      { label: "A5", width: 148, height: 210, unit: "mm" },
      { label: "Letter", width: 216, height: 279, unit: "mm" },
    ],
    units: ["mm", "cm", "in"], // Specify available units for paper sizes
  },
  imageSize: {
    predefined: [
      { label: "Web view", width: 1920, height: 1080, unit: "px" },
      { label: "Business card", width: 85, height: 55, unit: "mm" },
      { label: "Square web image", width: 1080, height: 1080, unit: "px" },
    ],
    units: ["px", "mm", "cm", "in"], // Specify available units for image sizes
  },
};
