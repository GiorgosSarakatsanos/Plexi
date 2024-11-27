import { RectangleTool } from "./RectangleTool";
import { EllipseTool } from "./EllipseTool";
import { PenTool } from "./PenTool";
import { LineTool } from "./LineTool";
import { HexagonTool } from "./HexagonTool";
import { TextTool } from "./TextTool";
import { Tool } from "./Tool";
import { SelectedShape } from "./ToolTypes";

// Define a function to add logging behavior
const withLogging = (toolName: string, tool: Tool): Tool => ({
  handleMouseDown: (e, stageRef, setDrawingShape) => {
    console.log(`${toolName} tool selected`);
    tool.handleMouseDown(e, stageRef, setDrawingShape);
  },
  handleMouseMove: (e, drawingShape, setDrawingShape) => {
    tool.handleMouseMove(e, drawingShape, setDrawingShape);
  },
  handleMouseUp: (
    setShapes,
    drawingShape,
    setDrawingShape,
    setSelectedTool,
    stageRef,
    addLayer,
    transformerRef,
    setSelectedShapeId
  ) => {
    tool.handleMouseUp(
      setShapes,
      drawingShape,
      setDrawingShape,
      setSelectedTool,
      stageRef,
      addLayer,
      transformerRef,
      setSelectedShapeId
    );
  },
});

// Define default (noop) tool behavior
const DefaultTool: Tool = {
  handleMouseDown: () => {},
  handleMouseMove: () => {},
  handleMouseUp: () => {},
};

// Initialize the ToolManager with the tools and logging
export const ToolManager: Record<SelectedShape, Tool> = {
  select: DefaultTool,
  rect: withLogging("Rectangle", RectangleTool),
  ellipse: withLogging("Ellipse", EllipseTool),
  line: withLogging("Line", LineTool),
  pen: withLogging("Pen", PenTool),
  text: withLogging("Text", TextTool),
  hexagon: withLogging("Hexagon", HexagonTool),
  image: withLogging("Image", {
    ...DefaultTool,
    handleMouseDown: () => {},
  }),
  area: withLogging("Area", {
    ...DefaultTool,
    handleMouseDown: () => {},
  }),
};
