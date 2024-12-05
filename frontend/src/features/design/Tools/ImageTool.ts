import { Tool } from "../helpers/Tool";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";
import { createShapeBase } from "../helpers/ShapeBase";

let uploadedImage: HTMLImageElement | null = null;

export const ImageTool: Tool = {
  setUploadedImage: (image: HTMLImageElement | null) => {
    uploadedImage = image;
  },
  handleMouseDown: (_e, stageRef, setDrawingShape) => {
    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition(); // Get the click position
    if (!pointerPos || !uploadedImage) return;

    const aspectRatio = uploadedImage.width / uploadedImage.height;
    const width = 100; // Default width for the image
    const height = width / aspectRatio;

    setDrawingShape({
      ...createShapeBase(pointerPos), // Base properties
      id: "image",
      type: "image",
      width: width,
      height: height,
      image: uploadedImage,
      strokeWidth: 0, // Images don't typically use stroke
      stroke: "", // No stroke by default for images
    });
  },
  handleMouseMove: () => {
    // No resizing or movement logic needed for now
  },
  handleMouseUp: commonHandleMouseUp,
};
