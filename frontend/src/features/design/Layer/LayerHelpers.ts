export interface Layer {
  id: string;
  name: string;
  isVisible: boolean;
  shapeType: string;
  groupId?: string;
  isGrouped: boolean;
  isGroupArea: boolean;
}
