// src/utils/idGenerator.ts
let currentId = 0;

export function generateId(): string {
  currentId += 1;
  return currentId.toString(); // Convert to string to match the Layer type
}
