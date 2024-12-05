let currentId = 0;

// Optionally load the last ID from local storage or a saved state.
if (typeof window !== "undefined" && localStorage.getItem("currentId")) {
  currentId = parseInt(localStorage.getItem("currentId") || "0", 10);
}

export function generateId(prefix = "shape"): string {
  currentId += 1;
  // Optionally save the currentId to local storage for persistence.
  if (typeof window !== "undefined") {
    localStorage.setItem("currentId", currentId.toString());
  }
  return `${prefix}-${currentId}`; // Add prefix for clarity
}

// import { v4 as uuidv4 } from "uuid";

// export function generateId(type: string): string {
//   return `${type}-${uuidv4()}`; // Combine type with the generated UUID
// }
