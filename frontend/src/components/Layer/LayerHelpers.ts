// src/components/Layer/LayerHelpers.ts
export interface Layer {
  id: string;
  name: string;
  isVisible: boolean;
  shapeType: string;
  isGrouped: boolean; // To identify if the layer is part of a group
  groupId?: string; // Optional group ID
  isGroupArea?: boolean;
}
