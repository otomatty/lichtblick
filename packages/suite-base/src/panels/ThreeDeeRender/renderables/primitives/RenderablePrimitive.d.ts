import { SceneEntity } from "@foxglove/schemas";
import { IRenderer } from "@lichtblick/suite-base/panels/ThreeDeeRender/IRenderer";
import { BaseUserData, Renderable } from "@lichtblick/suite-base/panels/ThreeDeeRender/Renderable";
import { RosValue } from "@lichtblick/suite-base/players/types";
import { LayerSettingsEntity } from "../../settings";
export type EntityRenderableUserData = BaseUserData & {
    topic?: string;
    entity?: SceneEntity;
    expiresAt?: bigint;
    settings?: LayerSettingsEntity;
};
export declare class RenderablePrimitive extends Renderable<EntityRenderableUserData> {
    constructor(name: string, renderer: IRenderer, userData?: EntityRenderableUserData);
    update(topic: string | undefined, entity: SceneEntity | undefined, settings: LayerSettingsEntity, receiveTime: bigint): void;
    idFromMessage(): number | string | undefined;
    selectedIdVariable(): string | undefined;
    getSettings(): LayerSettingsEntity | undefined;
    details(): Record<string, RosValue>;
    setColorScheme(colorScheme: "dark" | "light"): void;
    prepareForReuse(): void;
    addError(errorId: string, message: string): void;
    clearErrors(): void;
}
