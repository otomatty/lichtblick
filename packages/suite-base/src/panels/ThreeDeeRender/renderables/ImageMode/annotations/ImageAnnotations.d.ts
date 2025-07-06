import * as THREE from "three";
import { ICameraModel, Immutable, Topic } from "@lichtblick/suite";
import { Path } from "@lichtblick/suite-base/panels/ThreeDeeRender/LayerErrors";
import { LabelPool } from "@lichtblick/three-text";
import { AnyRendererSubscription, ImageModeConfig } from "../../../IRenderer";
import { SettingsTreeEntry } from "../../../SettingsManager";
import { IMessageHandler } from "../MessageHandler";
interface ImageAnnotationsContext {
    initialScale: number;
    initialCanvasWidth: number;
    initialCanvasHeight: number;
    initialPixelRatio: number;
    topics(): readonly Topic[];
    config(): Immutable<ImageModeConfig>;
    updateConfig(updateHandler: (draft: ImageModeConfig) => void): void;
    updateSettingsTree(): void;
    labelPool: LabelPool;
    messageHandler: IMessageHandler;
    addSettingsError(path: Path, errorId: string, errorMessage: string): void;
    removeSettingsError(path: Path, errorId: string): void;
}
/**
 * This class handles settings and rendering for ImageAnnotations/ImageMarkers.
 */
export declare class ImageAnnotations extends THREE.Object3D {
    #private;
    supportedAnnotationSchemas: Set<string>;
    constructor(context: ImageAnnotationsContext);
    getSubscriptions(): readonly AnyRendererSubscription[];
    handleTopicsChanged(topics: readonly Topic[] | undefined): void;
    dispose(): void;
    /** Called when seeking or a new data source is loaded.  */
    removeAllRenderables(): void;
    updateScale(scale: number, canvasWidth: number, canvasHeight: number, pixelRatio: number): void;
    updateCameraModel(cameraModel: ICameraModel): void;
    settingsNodes(): SettingsTreeEntry[];
}
export {};
