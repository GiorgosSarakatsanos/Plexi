/**
 * Safely evaluate a mathematical expression.
 * @param expression The mathematical expression to evaluate.
 * @returns The evaluated result as a string or an error message if invalid.
 */
export const evaluateExpression = (expression: string): string => {
  try {
    // Restricting letters and invalid characters
    if (!/^[0-9+\-*/.()]*$/.test(expression)) {
      throw new Error("Invalid characters in expression");
    }

    // Evaluate the mathematical expression
    const result = eval(expression); // Avoid in production; replace with a safe math library if needed

    // Ensure result is a valid number
    if (isNaN(result)) {
      throw new Error("Invalid calculation");
    }

    return String(result);
  } catch (error) {
    // Cast error to Error type to safely access message
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(errorMessage);
    return "Error";
  }
};
