import * as THREE from "three";
import { ICameraModel } from "@lichtblick/suite";
export declare class ImageModeCamera extends THREE.PerspectiveCamera {
    #private;
    updateCamera(cameraModel: ICameraModel | undefined): void;
    setPanOffset(offset: THREE.Vector2): void;
    getPanOffset(out: THREE.Vector2): void;
    resetModifications(): void;
    setRotation(rotation: 0 | 90 | 180 | 270): void;
    setFlipHorizontal(flipHorizontal: boolean): void;
    setFlipVertical(flipVertical: boolean): void;
    updateZoomFromWheel(ratio: number, cursorCoords: THREE.Vector2): void;
    /** Set canvas size in CSS pixels */
    setCanvasSize(width: number, height: number): void;
    /** @returns The ratio of CSS pixels per image pixel */
    getEffectiveScale(): number;
}
