import { useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { supabase } from "@/lib/supabase";

interface UseCanvasSyncProps {
  fabricCanvas: FabricCanvas | null;
}

export const useCanvasSync = ({ fabricCanvas }: UseCanvasSyncProps) => {
  const lastSyncRef = useRef<string>("");

  const broadcastDrawing = async () => {
    if (!fabricCanvas) return;
    
    const roomId = new URLSearchParams(window.location.search).get("room");
    if (!roomId) return;

    const canvasData = fabricCanvas.toJSON();
    if (JSON.stringify(canvasData) === lastSyncRef.current) return;

    await supabase
      .from('rooms')
      .update({ canvas_data: canvasData })
      .eq('id', roomId);

    lastSyncRef.current = JSON.stringify(canvasData);
    console.log("Canvas broadcasted to Supabase");
  };

  return { broadcastDrawing };
};