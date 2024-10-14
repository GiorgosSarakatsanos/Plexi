// This function will handle the button click actions
export const handleToolbarButtonClick = (
  id: number,
  setActiveButtonId: React.Dispatch<React.SetStateAction<number | null>>,
  setAddBox: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setActiveButtonId(id); // Set the clicked button as active

  if (id === 4) {
    // If the "Holder" button is clicked
    setAddBox(true); // Trigger the add box function in CanvasComponent
  }
};
