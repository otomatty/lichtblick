import { CameraCalibration } from "@foxglove/schemas";
import { ICameraModel } from "@lichtblick/suite";
import { PartialMessage } from "../SceneExtension";
import { CameraInfo, IncomingCameraInfo, Vector2, Vector3 } from "../ros";
export declare function projectPixel(out: Vector3, uv: Readonly<Vector2>, cameraModel: ICameraModel, settings: {
    distance: number;
    planarProjectionFactor: number;
}): Vector3;
export declare function cameraInfosEqual(a: CameraInfo | undefined, b: CameraInfo | undefined): boolean;
export declare function normalizeCameraInfo(message: PartialMessage<IncomingCameraInfo> & PartialMessage<CameraCalibration>): CameraInfo;
