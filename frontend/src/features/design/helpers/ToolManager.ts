import Konva from "konva";
import { Tool } from "./Tool";
import { RectangleTool } from "../Tools/RectangleTool";
import { EllipseTool } from "../Tools/EllipseTool";
import { PenTool } from "../Tools/PenTool";
import { LineTool } from "../Tools/LineTool";
import { HexagonTool } from "../Tools/HexagonTool";
import { ImageTool } from "../Tools/ImageTool";
import { TextTool } from "../Tools/TextTool";
import { SelectedShape } from "./ToolTypes";
import { uploadImage } from "./uploadImage"; // Import uploader
import { displayFloatingThumbnail } from "./displayFloatingThumbnail";
import { AreaTool } from "../Tools/AreaTool";

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
  text: TextTool,
  area: AreaTool,
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
};
