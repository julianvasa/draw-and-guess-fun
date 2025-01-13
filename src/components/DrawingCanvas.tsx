import { DrawingCanvasProps } from "@/types";
import { CanvasContainer } from "./canvas/CanvasContainer";

export const DrawingCanvas = (props: DrawingCanvasProps) => {
  return <CanvasContainer {...props} />;
};