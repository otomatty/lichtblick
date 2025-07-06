import * as THREE from "three";
import { VideoPlayer } from "@lichtblick/den/video";
import { ICameraModel } from "@lichtblick/suite";
import { IRenderer } from "@lichtblick/suite-base/panels/ThreeDeeRender/IRenderer";
import { BaseUserData, Renderable } from "@lichtblick/suite-base/panels/ThreeDeeRender/Renderable";
import { WorkerImageDecoder } from "@lichtblick/suite-base/panels/ThreeDeeRender/renderables/Images/WorkerImageDecoder";
import { RosValue } from "@lichtblick/suite-base/players/types";
import { AnyImage } from "./ImageTypes";
import { CameraInfo } from "../../ros";
import { ColorModeSettings } from "../colorMode";
export interface ImageRenderableSettings extends Partial<ColorModeSettings> {
    visible: boolean;
    frameLocked?: boolean;
    cameraInfoTopic: string | undefined;
    distance: number;
    planarProjectionFactor: number;
    color: string;
}
export declare const IMAGE_RENDERABLE_DEFAULT_SETTINGS: ImageRenderableSettings;
export type ImageUserData = BaseUserData & {
    topic: string;
    settings: ImageRenderableSettings;
    firstMessageTime: bigint | undefined;
    cameraInfo: CameraInfo | undefined;
    cameraModel: ICameraModel | undefined;
    image: AnyImage | undefined;
    texture: THREE.Texture | undefined;
    material: THREE.MeshBasicMaterial | undefined;
    geometry: THREE.PlaneGeometry | undefined;
    mesh: THREE.Mesh | undefined;
};
export declare class ImageRenderable extends Renderable<ImageUserData> {
    #private;
    videoPlayer: VideoPlayer | undefined;
    protected decoder?: WorkerImageDecoder;
    constructor(topicName: string, renderer: IRenderer, userData: ImageUserData);
    protected isDisposed(): boolean;
    getDecodedImage(): ImageBitmap | ImageData | undefined;
    dispose(): void;
    updateHeaderInfo(): void;
    details(): Record<string, RosValue>;
    setRenderBehindScene(): void;
    setCameraModel(cameraModel: ICameraModel): void;
    setSettings(newSettings: ImageRenderableSettings): void;
    setImage(image: AnyImage, resizeWidth?: number, onDecoded?: () => void): void;
    protected decodeImage(image: AnyImage, resizeWidth?: number): Promise<ImageBitmap | ImageData>;
    update(): void;
    protected addError(key: string, message: string): void;
    protected removeError(key: string): void;
}
