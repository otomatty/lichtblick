import { CompressedImage, RawImage } from "@foxglove/schemas";
import { PartialMessage } from "@lichtblick/suite-base/panels/ThreeDeeRender/SceneExtension";
import { CompressedVideo } from "./ImageTypes";
import { Image as RosImage, CompressedImage as RosCompressedImage } from "../../ros";
export declare function normalizeRosImage(message: PartialMessage<RosImage>): RosImage;
export declare function normalizeRosCompressedImage(message: PartialMessage<RosCompressedImage>): RosCompressedImage;
export declare function normalizeRawImage(message: PartialMessage<RawImage>): RawImage;
export declare function normalizeCompressedImage(message: PartialMessage<CompressedImage>): CompressedImage;
export declare function normalizeCompressedVideo(message: PartialMessage<CompressedVideo>): CompressedVideo;
