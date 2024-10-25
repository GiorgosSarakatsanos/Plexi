// utils/idGenerator.ts

let currentId = 0;

export function generateId(): number {
  currentId += 1;
  return currentId;
}
