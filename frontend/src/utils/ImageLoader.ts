// ImageLoader.ts
export const loadImageAsync = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

export const uploadAndLoadImage = async (
  uploadImage: () => Promise<string | null>
): Promise<HTMLImageElement | null> => {
  try {
    const imageUrl = await uploadImage();
    if (!imageUrl) return null;

    const loadedImage = await loadImageAsync(imageUrl);
    return loadedImage;
  } catch (error) {
    console.error("Error uploading/loading image:", error);
    return null;
  }
};
