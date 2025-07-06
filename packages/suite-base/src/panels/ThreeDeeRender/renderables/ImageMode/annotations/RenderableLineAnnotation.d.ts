import { ICameraModel } from "@lichtblick/suite";
import { RosObject, RosValue } from "@lichtblick/suite-base/players/types";
import { PointsAnnotation as NormalizedPointsAnnotation, CircleAnnotation as NormalizedCircleAnnotation } from "./types";
import { BaseUserData, Renderable } from "../../../Renderable";
/** subset of {@link NormalizedPointsAnnotation.style} */
type LineStyle = "polygon" | "line_strip" | "line_list";
/**
 * Handles rendering of 2D annotations (line list, line strip, and line loop/polygon).
 */
export declare class RenderableLineAnnotation extends Renderable<BaseUserData, /*TRenderer=*/ undefined> {
    #private;
    constructor(topicName: string);
    dispose(): void;
    details(): Record<string, RosValue>;
    setScale(scale: number, canvasWidth: number, canvasHeight: number, _pixelRatio: number): void;
    setCameraModel(cameraModel: ICameraModel | undefined): void;
    setAnnotation(annotation: NormalizedPointsAnnotation & {
        style: LineStyle;
    }, originalMessage: RosObject | undefined): void;
    setAnnotationFromCircle(annotation: NormalizedCircleAnnotation, originalMessage: RosObject | undefined): void;
    update(): void;
}
export {};
