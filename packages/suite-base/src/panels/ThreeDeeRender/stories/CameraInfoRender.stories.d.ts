/// <reference types="react" />
import { StoryObj } from "@storybook/react";
declare const _default: {
    title: string;
    component: import("react").ComponentType<{
        childId?: string | undefined;
        overrideConfig?: {} | undefined;
        tabId?: string | undefined;
    } & Omit<{
        config: Record<string, unknown>;
        saveConfig: import("../../../types/panels").SaveConfig<Record<string, unknown>>;
        onDownloadImage?: ((blob: Blob, fileName: string) => void) | undefined;
        debugPicking?: boolean | undefined;
    }, "config" | "saveConfig">> & import("../../../components/Panel").PanelStatics<{}>;
};
export default _default;
export declare const CameraInfoRender: StoryObj;
export declare const CameraInfoRenderChinese: {
    parameters: {
        colorScheme: string;
        forceLanguage: string;
    };
    decorators?: import("storybook/internal/csf").DecoratorFunction<import("@storybook/react/dist/types-5617c98e").R, {}> | import("storybook/internal/csf").DecoratorFunction<import("@storybook/react/dist/types-5617c98e").R, {}>[] | undefined;
    args?: (Partial<{}> & {}) | undefined;
    argTypes?: Partial<import("storybook/internal/csf").ArgTypes<{}>> | undefined;
    loaders?: import("storybook/internal/csf").LoaderFunction<import("@storybook/react/dist/types-5617c98e").R, {}> | import("storybook/internal/csf").LoaderFunction<import("@storybook/react/dist/types-5617c98e").R, {}>[] | undefined;
    beforeEach?: import("storybook/internal/csf").BeforeEach<import("@storybook/react/dist/types-5617c98e").R, {}> | import("storybook/internal/csf").BeforeEach<import("@storybook/react/dist/types-5617c98e").R, {}>[] | undefined;
    afterEach?: import("storybook/internal/csf").AfterEach<import("@storybook/react/dist/types-5617c98e").R, {}> | import("storybook/internal/csf").AfterEach<import("@storybook/react/dist/types-5617c98e").R, {}>[] | undefined;
    render?: import("storybook/internal/csf").ArgsStoryFn<import("@storybook/react/dist/types-5617c98e").R, {}> | undefined;
    tags?: string[] | undefined;
    mount?: ((context: import("storybook/internal/csf").StoryContext<import("@storybook/react/dist/types-5617c98e").R, {}>) => (ui?: import("react").JSX.Element | undefined) => Promise<import("storybook/internal/csf").Canvas>) | undefined;
    name?: string | undefined;
    storyName?: string | undefined;
    play?: import("storybook/internal/csf").PlayFunction<import("@storybook/react/dist/types-5617c98e").R, {}> | undefined;
    globals?: import("storybook/internal/csf").Globals | undefined;
    story?: Omit<import("storybook/internal/csf").StoryAnnotations<import("@storybook/react/dist/types-5617c98e").R, {}, Partial<{}>>, "story"> | undefined;
};
export declare const CameraInfoRenderJapanese: {
    parameters: {
        colorScheme: string;
        forceLanguage: string;
    };
    decorators?: import("storybook/internal/csf").DecoratorFunction<import("@storybook/react/dist/types-5617c98e").R, {}> | import("storybook/internal/csf").DecoratorFunction<import("@storybook/react/dist/types-5617c98e").R, {}>[] | undefined;
    args?: (Partial<{}> & {}) | undefined;
    argTypes?: Partial<import("storybook/internal/csf").ArgTypes<{}>> | undefined;
    loaders?: import("storybook/internal/csf").LoaderFunction<import("@storybook/react/dist/types-5617c98e").R, {}> | import("storybook/internal/csf").LoaderFunction<import("@storybook/react/dist/types-5617c98e").R, {}>[] | undefined;
    beforeEach?: import("storybook/internal/csf").BeforeEach<import("@storybook/react/dist/types-5617c98e").R, {}> | import("storybook/internal/csf").BeforeEach<import("@storybook/react/dist/types-5617c98e").R, {}>[] | undefined;
    afterEach?: import("storybook/internal/csf").AfterEach<import("@storybook/react/dist/types-5617c98e").R, {}> | import("storybook/internal/csf").AfterEach<import("@storybook/react/dist/types-5617c98e").R, {}>[] | undefined;
    render?: import("storybook/internal/csf").ArgsStoryFn<import("@storybook/react/dist/types-5617c98e").R, {}> | undefined;
    tags?: string[] | undefined;
    mount?: ((context: import("storybook/internal/csf").StoryContext<import("@storybook/react/dist/types-5617c98e").R, {}>) => (ui?: import("react").JSX.Element | undefined) => Promise<import("storybook/internal/csf").Canvas>) | undefined;
    name?: string | undefined;
    storyName?: string | undefined;
    play?: import("storybook/internal/csf").PlayFunction<import("@storybook/react/dist/types-5617c98e").R, {}> | undefined;
    globals?: import("storybook/internal/csf").Globals | undefined;
    story?: Omit<import("storybook/internal/csf").StoryAnnotations<import("@storybook/react/dist/types-5617c98e").R, {}, Partial<{}>>, "story"> | undefined;
};
