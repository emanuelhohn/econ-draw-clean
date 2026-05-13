import { useRef, useCallback, useState } from "react";
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

const TEMPLATE_ELEMENTS = [
  { id: "y-axis", type: "arrow", x: 120, y: 480, width: 2, height: -360, angle: 0, strokeColor: "#1a1a1a", backgroundColor: "transparent", fillStyle: "solid", strokeWidth: 2, strokeStyle: "solid", roughness: 0, opacity: 100, points: [[0,0],[0,-360]], startArrowhead: null, endArrowhead: "arrow", roundness: null, version: 1, versionNonce: 1, isDeleted: false, groupIds: [], boundElements: [], updated: 1, link: null, locked: true, frameId: null },
  { id: "x-axis", type: "arrow", x: 120, y: 480, width: 420, height: 2, angle: 0, strokeColor: "#1a1a1a", backgroundColor: "transparent", fillStyle: "solid", strokeWidth: 2, strokeStyle: "solid", roughness: 0, opacity: 100, points: [[0,0],[420,0]], startArrowhead: null, endArrowhead: "arrow", roundness: null, version: 1, versionNonce: 2, isDeleted: false, groupIds: [], boundElements: [], updated: 1, link: null, locked: true, frameId: null },
  { id: "nachfrage", type: "line", x: 150, y: 150, width: 330, height: 290, angle: 0, strokeColor: "#1971c2", backgroundColor: "transparent", fillStyle: "solid", strokeWidth: 3, strokeStyle: "solid", roughness: 1, opacity: 100, points: [[0,0],[330,290]], roundness: { type: 2 }, version: 1, versionNonce: 5, isDeleted: false, groupIds: [], boundElements: [], updated: 1, link: null, locked: true, frameId: null },
  { id: "angebot", type: "line", x: 150, y: 440, width: 330, height: -290, angle: 0, strokeColor: "#c2255c", backgroundColor: "transparent", fillStyle: "solid", strokeWidth: 3, strokeStyle: "solid", roughness: 1, opacity: 100, points: [[0,0],[330,-290]], roundness: { type: 2 }, version: 1, versionNonce: 7, isDeleted: false, groupIds: [], boundElements: [], updated: 1, link: null, locked: true, frameId: null },
  { id: "gw", type: "ellipse", x: 307, y: 287, width: 18, height: 18, angle: 0, strokeColor: "#2f9e44", backgroundColor: "#2f9e44", fillStyle: "solid", strokeWidth: 1, strokeStyle: "solid", roughness: 0, opacity: 100, roundness: { type: 3 }, version: 1, versionNonce: 9, isDeleted: false, groupIds: [], boundElements: [], updated: 1, link: null, locked: true, frameId: null },
  { id: "pline", type: "line", x: 120, y: 296, width: 196, height: 0, angle: 0, strokeColor: "#2f9e44", backgroundColor: "transparent", fillStyle: "solid", strokeWidth: 1.5, strokeStyle: "dashed", roughness: 0, opacity: 70, points: [[0,0],[196,0]], roundness: null, version: 1, versionNonce: 11, isDeleted: false, groupIds: [], boundElements: [], updated: 1, link: null, locked: true, frameId: null },
  { id: "qline", type: "line", x: 316, y: 296, width: 0, height: 184, angle: 0, strokeColor: "#2f9e44", backgroundColor: "transparent", fillStyle: "solid", strokeWidth: 1.5, strokeStyle: "dashed", roughness: 0, opacity: 70, points: [[0,0],[0,184]], roundness: null, version: 1, versionNonce: 12, isDeleted: false, groupIds: [], boundElements: [], updated: 1, link: null, locked: true, frameId: null },
];

export function ZeichenSection() {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const [ready, setReady] = useState(false);

  const loadTemplate = useCallback((api: ExcalidrawImperativeAPI) => {
    api.updateScene({ elements: TEMPLATE_ELEMENTS as never });
    setTimeout(() => {
      api.scrollToContent(undefined, { fitToViewport: true, animate: false });
    }, 150);
  }, []);

  const handleReady = useCallback((api: ExcalidrawImperativeAPI) => {
    apiRef.current = api;
    setReady(true);
    setTimeout(() => loadTemplate(api), 400);
  }, [loadTemplate]);

  const reloadTemplate = useCallback(() => {
    if (apiRef.current) loadTemplate(apiRef.current);
  }, [loadTemplate]);

  const resetCanvas = useCallback(() => {
    apiRef.current?.updateScene({ elements: [] });
  }, []);

  const downloadPng = useCallback(async () => {
    const api = apiRef.current;
    if (!api) return;
    const elements = api.getSceneElements();
    if (!elements.length) return;
    const blob = await exportToBlob({
      elements,
      appState: { exportBackground: true, viewBackgroundColor: "#ffffff" },
      files: api.getFiles(),
      mimeType: "image/png",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zeichnung.png";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div style={{ padding: "2rem 2rem 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Aufgabe: Zeichne auf dem Diagramm</h3>
          <p style={{ fontSize: 12, color: "#888" }}>Verwende die Werkzeuge um das Diagramm zu beschriften oder zu verändern</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={resetCanvas} disabled={!ready} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, border: "1px solid #ddd", background: "transparent", color: "#666", cursor: "pointer" }}>Leere Fläche</button>
          <button onClick={reloadTemplate} disabled={!ready} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, border: "1px solid #ddd", background: "transparent", color: "#666", cursor: "pointer" }}>Template neu laden</button>
          <button onClick={downloadPng} disabled={!ready} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, border: "none", background: "#1971c2", color: "#fff", cursor: "pointer" }}>PNG speichern</button>
        </div>
      </div>
      <div style={{ height: 500, border: "1px solid #e5e5e5", borderRadius: 10, overflow: "hidden", marginBottom: "2rem" }}>
        <Excalidraw
          excalidrawAPI={handleReady}
          langCode="de-DE"
          UIOptions={{
            canvasActions: { saveToActiveFile: false, loadScene: false, export: false },
          }}
        />
      </div>
    </div>
  );
}
