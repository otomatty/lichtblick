import { Theme } from "@mui/material";
import { OffscreenCanvasRenderer } from "../OffscreenCanvasRenderer";
declare const useRenderer: (canvasDiv: HTMLDivElement | ReactNull, theme: Theme) => OffscreenCanvasRenderer | undefined;
export default useRenderer;
