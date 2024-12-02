import Konva from "konva";

export const displayFloatingThumbnail = (
  stage: Konva.Stage,
  uploadedImage: HTMLImageElement
): (() => void) => {
  // Find the first layer
  const layer = stage.findOne<Konva.Layer>(
    (node) => node instanceof Konva.Layer
  );

  if (!layer) {
    console.error("No layer found to display the thumbnail.");
    return () => {}; // Return a no-op cleanup function
  }

  // Create a thumbnail image
  const thumbnail = new Konva.Image({
    image: uploadedImage,
    width: uploadedImage.width / 8,
    height: uploadedImage.height / 8,
    opacity: 0.5,
    listening: false, // Prevent interactions with the thumbnail
  });

  layer.add(thumbnail);
  layer.batchDraw(); // Initial draw to show the thumbnail

  // Update the thumbnail position with mouse movement
  const handleMouseMove = () => {
    const pointerPos = stage.getPointerPosition();
    if (pointerPos) {
      thumbnail.x(pointerPos.x + 10); // Offset thumbnail slightly to the right
      thumbnail.y(pointerPos.y + 10); // Offset thumbnail slightly below
      layer.batchDraw(); // Efficiently update the layer
    } else {
      console.error("Pointer position is null!");
    }
  };

  stage.on("mousemove", handleMouseMove);

  // Return a cleanup function to remove the thumbnail and listeners
  return () => {
    thumbnail.destroy();
    stage.off("mousemove", handleMouseMove);
    layer.batchDraw(); // Redraw the layer to remove the thumbnail
  };
};
