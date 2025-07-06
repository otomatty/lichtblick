import { CameraModelsMap } from "@lichtblick/den/image/types";
import { ICameraModel, SettingsTreeAction } from "@lichtblick/suite";
import type { RosValue } from "@lichtblick/suite-base/players/types";
import { RenderableLineList } from "./markers/RenderableLineList";
import type { AnyRendererSubscription, IRenderer } from "../IRenderer";
import { BaseUserData, Renderable } from "../Renderable";
import { SceneExtension } from "../SceneExtension";
import { SettingsTreeEntry } from "../SettingsManager";
import { CameraInfo } from "../ros";
import { BaseSettings } from "../settings";
export type LayerSettingsCameraInfo = BaseSettings & {
    distance: number;
    planarProjectionFactor: number;
    width: number;
    color: string;
};
export type CameraInfoUserData = BaseUserData & {
    settings: LayerSettingsCameraInfo;
    topic: string;
    cameraInfo: CameraInfo | undefined;
    originalMessage: Record<string, RosValue> | undefined;
    cameraModel: ICameraModel | undefined;
    lines: RenderableLineList | undefined;
};
export declare class CameraInfoRenderable extends Renderable<CameraInfoUserData> {
    dispose(): void;
    details(): Record<string, RosValue>;
}
export declare class Cameras extends SceneExtension<CameraInfoRenderable> {
    #private;
    static extensionId: string;
    customCameraModels: CameraModelsMap;
    constructor(renderer: IRenderer, name?: string);
    getSubscriptions(): readonly AnyRendererSubscription[];
    settingsNodes(): SettingsTreeEntry[];
    handleSettingsAction: (action: SettingsTreeAction) => void;
    setCustomCameraModels(newCameraModels: CameraModelsMap): void;
}
