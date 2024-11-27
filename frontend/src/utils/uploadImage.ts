export const uploadImage = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string); // Ensure the result is a base64 string
      };
      reader.readAsDataURL(file);
    };

    input.click();
  });
};
