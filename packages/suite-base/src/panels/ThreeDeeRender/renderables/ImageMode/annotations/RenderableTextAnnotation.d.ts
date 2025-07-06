import { ICameraModel } from "@lichtblick/suite";
import { RosObject, RosValue } from "@lichtblick/suite-base/players/types";
import { LabelPool } from "@lichtblick/three-text";
import { TextAnnotation as NormalizedTextAnnotation } from "./types";
import { BaseUserData, Renderable } from "../../../Renderable";
/**
 * Handles rendering of 2D text annotations.
 */
export declare class RenderableTextAnnotation extends Renderable<BaseUserData, /*TRenderer=*/ undefined> {
    #private;
    constructor(topicName: string, labelPool: LabelPool);
    dispose(): void;
    details(): Record<string, RosValue>;
    setScale(scale: number, _canvasWidth: number, _canvasHeight: number, _pixelRatio: number): void;
    setCameraModel(cameraModel: ICameraModel | undefined): void;
    setAnnotation(annotation: NormalizedTextAnnotation, originalMessage: RosObject | undefined): void;
    update(): void;
}
