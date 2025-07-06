import { SettingsTreeAction } from "@lichtblick/suite";
import type { RosValue } from "@lichtblick/suite-base/players/types";
import type { AnyRendererSubscription, IRenderer } from "../IRenderer";
import { BaseUserData, Renderable } from "../Renderable";
import { SceneExtension } from "../SceneExtension";
import { SettingsTreeEntry } from "../SettingsManager";
import { PolygonStamped } from "../ros";
import { BaseSettings } from "../settings";
import { RenderableLineStrip } from "./markers/RenderableLineStrip";
export type LayerSettingsPolygon = BaseSettings & {
    lineWidth: number;
    color: string;
};
export type PolygonUserData = BaseUserData & {
    settings: LayerSettingsPolygon;
    topic: string;
    polygonStamped: PolygonStamped;
    lines: RenderableLineStrip | undefined;
};
export declare class PolygonRenderable extends Renderable<PolygonUserData> {
    dispose(): void;
    details(): Record<string, RosValue>;
}
export declare class Polygons extends SceneExtension<PolygonRenderable> {
    #private;
    static extensionId: string;
    constructor(renderer: IRenderer, name?: string);
    getSubscriptions(): readonly AnyRendererSubscription[];
    settingsNodes(): SettingsTreeEntry[];
    handleSettingsAction: (action: SettingsTreeAction) => void;
}
