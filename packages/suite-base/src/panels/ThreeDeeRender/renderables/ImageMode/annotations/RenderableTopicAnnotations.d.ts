import * as THREE from "three";
import { ICameraModel } from "@lichtblick/suite";
import { RosObject } from "@lichtblick/suite-base/players/types";
import { LabelPool } from "@lichtblick/three-text";
import { Annotation as NormalizedAnnotation } from "./types";
/**
 * Holds renderables for all the 2D image annotations on a single topic.
 */
export declare class RenderableTopicAnnotations extends THREE.Object3D {
    #private;
    constructor(topicName: string, labelPool: LabelPool);
    dispose(): void;
    setScale(scale: number, canvasWidth: number, canvasHeight: number, pixelRatio: number): void;
    setOriginalMessage(originalMessage: RosObject | undefined): void;
    setCameraModel(cameraModel: ICameraModel | undefined): void;
    setAnnotations(annotations: NormalizedAnnotation[]): void;
    update(): void;
}
