import { CompressedImage, RawImage } from "@foxglove/schemas";
import { Time } from "@lichtblick/rostime";
import { Image as RosImage, CompressedImage as RosCompressedImage } from "../../ros";
export declare const ALL_CAMERA_INFO_SCHEMAS: Set<string>;
/** NOTE: Remove this definition once it is available in @foxglove/schemas */
export type CompressedVideo = {
    timestamp: Time;
    frame_id: string;
    data: Uint8Array;
    format: string;
};
export type CompressedImageTypes = RosCompressedImage | CompressedImage;
export type AnyImage = RosImage | RosCompressedImage | RawImage | CompressedImage | CompressedVideo;
export declare function getFrameIdFromImage(image: AnyImage): string;
export declare function getTimestampFromImage(image: AnyImage): Time;
