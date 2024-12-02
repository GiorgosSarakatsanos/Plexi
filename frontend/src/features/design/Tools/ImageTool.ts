import { Tool } from "../helpers/Tool";
import { commonHandleMouseUp } from "../mouseActions/commonMouseUp";
import { generateId } from "../../utils/idGenerator";

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
      id: generateId("image"),
      type: "image",
      x: pointerPos.x, // Use pointer position for placement
      y: pointerPos.y, // Use pointer position for placement
      width: width,
      height: height,
      image: uploadedImage,
      layerId: "",
      draggable: true,
      listening: true,
      strokeWidth: 0, // Default strokeWidth for images
      stroke: "", // Default stroke for images (or any value you find suitable)
      fill: "transparent", // Images typically don't use a fill color
    });
  },
  handleMouseMove: () => {
    // No resizing or movement logic needed for now
  },
  handleMouseUp: commonHandleMouseUp,
};
