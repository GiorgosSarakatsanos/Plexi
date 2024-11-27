import Konva from "konva";

export const displayFloatingThumbnail = (
  stage: Konva.Stage,
  uploadedImage: HTMLImageElement
): (() => void) => {
  // Use a type guard to ensure the node is a Konva.Layer
  const layer = stage.findOne(
    (node: Konva.Node): node is Konva.Layer => node instanceof Konva.Layer
  );

  if (!layer) {
    console.error("No layer found to display the thumbnail.");
    return () => {}; // Return a no-op cleanup function
  }

  // Create a thumbnail image
  const thumbnail = new Konva.Image({
    image: uploadedImage,
    width: uploadedImage.width / 4,
    height: uploadedImage.height / 4,
    opacity: 0.5,
    listening: false, // Prevent interactions with the thumbnail
  });

  layer.add(thumbnail);

  // Update the thumbnail position with mouse movement
  const handleMouseMove = (event: Konva.KonvaEventObject<MouseEvent>) => {
    const pointerPos = stage.getPointerPosition();
    if (pointerPos) {
      thumbnail.x(pointerPos.x + 10); // Offset thumbnail slightly to the right
      thumbnail.y(pointerPos.y + 10); // Offset thumbnail slightly below
      layer.batchDraw(); // Efficiently update the layer
    }
  };

  stage.on("mousemove", handleMouseMove);

  // Return a cleanup function to remove the thumbnail and listeners
  return () => {
    thumbnail.destroy();
    stage.off("mousemove", handleMouseMove);
    layer.draw(); // Redraw the layer to remove the thumbnail
  };
};
