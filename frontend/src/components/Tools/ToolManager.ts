import { RectangleTool } from "./RectangleTool";
import { EllipseTool } from "./EllipseTool";
import { PenTool } from "./PenTool";
import { LineTool } from "./LineTool";
import { HexagonTool } from "./HexagonTool";
import { ImageTool } from "./ImageTool";
import { Tool } from "./Tool";
import { SelectedShape } from "./ToolTypes";
import { uploadImage } from "../../utils/uploadImage"; // Import uploader
import { displayFloatingThumbnail } from "../../utils/displayFloatingThumbnail";
import Konva from "konva";

// Extend the Tool type to include `setUploadedImage` globally
export interface ExtendedTool extends Tool {
  onSelect?: (stage: Konva.Stage) => void | Promise<void>; // Updated to support async
  setUploadedImage?: (image: HTMLImageElement | null) => void;
}

export const ToolManager: Record<SelectedShape, ExtendedTool> = {
  select: {
    handleMouseDown: () => {},
    handleMouseMove: () => {},
    handleMouseUp: () => {},
  },
  rect: RectangleTool,
  ellipse: EllipseTool,
  line: LineTool,
  pen: PenTool,
  hexagon: HexagonTool,
  image: {
    ...ImageTool,
    onSelect: async (stage: Konva.Stage) => {
      const imageUrl: string | null = await uploadImage();
      if (!imageUrl) {
        console.log("Image upload canceled or failed.");
        return;
      }

      const uploadedImage = new Image();
      uploadedImage.src = imageUrl;

      uploadedImage.onload = () => {
        displayFloatingThumbnail(stage, uploadedImage);
        ImageTool.setUploadedImage?.(uploadedImage); // Pass the HTMLImageElement
      };
    },
  },
  text: {
    handleMouseDown: () => console.log("Text tool selected"),
    handleMouseMove: () => {},
    handleMouseUp: () => {},
  },
  area: {
    handleMouseDown: () => console.log("Area tool selected"),
    handleMouseMove: () => {},
    handleMouseUp: () => {},
  },
};
