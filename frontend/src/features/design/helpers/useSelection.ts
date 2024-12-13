import { useState } from "react";

export const useSelection = <T extends { id: string }>(items: T[]) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectItem = (id: string, ctrlKey = false, shiftKey = false) => {
    setSelectedIds((prevSelected) => {
      let updatedSelection: string[] = [];

      if (shiftKey) {
        const lastSelectedId = prevSelected[prevSelected.length - 1];
        const lastSelectedIndex = items.findIndex(
          (item) => item.id === lastSelectedId
        );
        const clickedIndex = items.findIndex((item) => item.id === id);

        if (lastSelectedIndex >= 0 && clickedIndex >= 0) {
          const [start, end] = [
            Math.min(lastSelectedIndex, clickedIndex),
            Math.max(lastSelectedIndex, clickedIndex),
          ];
          updatedSelection = Array.from(
            new Set([
              ...prevSelected,
              ...items.slice(start, end + 1).map((item) => item.id),
            ])
          );
        }
      } else if (ctrlKey) {
        updatedSelection = prevSelected.includes(id)
          ? prevSelected.filter((selectedId) => selectedId !== id)
          : [...prevSelected, id];
      } else {
        updatedSelection = [id];
      }

      return updatedSelection;
    });
  };

  const deselectItem = (id?: string) => {
    setSelectedIds((prevSelected) =>
      id ? prevSelected.filter((selectedId) => selectedId !== id) : []
    );
  };

  return { selectedIds, selectItem, deselectItem, setSelectedIds };
};
