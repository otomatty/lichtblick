import { DeepPartial } from "ts-essentials";
import { CameraModelsMap } from "@lichtblick/den/image/types";
import { BuiltinPanelExtensionContext } from "@lichtblick/suite-base/components/PanelExtensionAdapter";
import { FollowMode, TestOptions } from "@lichtblick/suite-base/panels/ThreeDeeRender/IRenderer";
import { SceneExtensionConfig } from "@lichtblick/suite-base/panels/ThreeDeeRender/SceneExtensionConfig";
import { CameraState } from "@lichtblick/suite-base/panels/ThreeDeeRender/camera";
export type InterfaceMode = "3d" | "image";
export type Shared3DPanelState = {
    cameraState: CameraState;
    followMode: FollowMode;
    followTf: undefined | string;
};
export type ThreeDeeRenderProps = {
    context: BuiltinPanelExtensionContext;
    interfaceMode: InterfaceMode;
    testOptions: TestOptions;
    /** Allow for injection or overriding of default extensions by custom extensions */
    customSceneExtensions?: DeepPartial<SceneExtensionConfig>;
    customCameraModels: CameraModelsMap;
};
