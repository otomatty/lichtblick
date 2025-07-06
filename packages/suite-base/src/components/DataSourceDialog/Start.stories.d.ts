/// <reference types="react" />
import { StoryObj } from "@storybook/react";
import { DataSourceDialog } from "./DataSourceDialog";
declare const _default: {
    title: string;
    component: typeof DataSourceDialog;
    parameters: {
        colorScheme: string;
    };
    decorators: ((Story: import("storybook/internal/csf").AnnotatedStoryFn<import("@storybook/react/dist/types-5617c98e").R, import("storybook/internal/csf").Args>) => import("react").JSX.Element)[];
};
export default _default;
export declare const DefaultLight: StoryObj;
export declare const DefaultDark: StoryObj;
export declare const UserNoAuth: StoryObj;
export declare const UserNoAuthChinese: StoryObj;
export declare const UserNoAuthJapanese: StoryObj;
export declare const UserPrivate: StoryObj;
export declare const UserPrivateChinese: StoryObj;
export declare const UserPrivateJapanese: StoryObj;
export declare const UserAuthedFree: StoryObj;
export declare const UserAuthedFreeChinese: StoryObj;
export declare const UserAuthedFreeJapanese: StoryObj;
export declare const UserAuthedPaid: StoryObj;
export declare const UserAuthedPaidChinese: StoryObj;
export declare const UserAuthedPaidJapanese: StoryObj;
