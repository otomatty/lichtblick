/// <reference types="react" />
import { StoryObj } from "@storybook/react";
import MockMessagePipelineProvider from "@lichtblick/suite-base/components/MessagePipeline/MockMessagePipelineProvider";
import PlaybackSpeedControls from "@lichtblick/suite-base/components/PlaybackSpeedControls";
declare const _default: {
    title: string;
    component: typeof PlaybackSpeedControls;
    parameters: {
        colorScheme: string;
    };
    decorators: ((WrappedStory: import("storybook/internal/csf").PartialStoryFn<import("@storybook/react/dist/types-5617c98e").R, {
        name?: string | undefined;
        presence?: import("../players/types").PlayerPresence | undefined;
        topics?: import("../players/types").Topic[] | undefined;
        topicStats?: Map<string, import("../players/types").TopicStats> | undefined;
        datatypes?: import("../types/RosDatatypes").RosDatatypes | undefined;
        messages?: import("@lichtblick/suite").MessageEvent[] | undefined;
        alerts?: import("../players/types").PlayerAlert[] | undefined;
        publish?: ((request: import("../players/types").PublishPayload) => void) | undefined;
        callService?: ((service: string, request: unknown) => Promise<unknown>) | undefined;
        setPublishers?: ((arg0: string, arg1: import("../players/types").AdvertiseOptions[]) => void) | undefined;
        setSubscriptions?: ((arg0: string, arg1: readonly {
            readonly topic: string;
            readonly fields?: readonly string[] | undefined;
            readonly preloadType?: import("../players/types").SubscriptionPreloadType | undefined;
        }[]) => void) | undefined;
        setParameter?: ((key: string, value: import("@lichtblick/suite").ParameterValue) => void) | undefined;
        fetchAsset?: ((uri: string, options?: {
            signal?: AbortSignal | undefined;
            referenceUrl?: string | undefined;
        } | undefined) => Promise<import("./PanelExtensionAdapter").Asset>) | undefined;
        noActiveData?: boolean | undefined;
        activeData?: Partial<import("../players/types").PlayerStateActiveData> | undefined;
        capabilities?: string[] | undefined;
        profile?: string | undefined;
        startPlayback?: (() => void) | undefined;
        pausePlayback?: (() => void) | undefined;
        seekPlayback?: ((arg0: import("@lichtblick/rostime").Time) => void) | undefined;
        currentTime?: import("@lichtblick/rostime").Time | undefined;
        startTime?: import("@lichtblick/rostime").Time | undefined;
        endTime?: import("@lichtblick/rostime").Time | undefined;
        isPlaying?: boolean | undefined;
        pauseFrame?: ((arg0: string) => () => void) | undefined;
        playerId?: string | undefined;
        progress?: Readonly<{
            fullyLoadedFractionRanges?: import("../util/ranges").Range[] | undefined;
            readonly messageCache?: import("../players/types").BlockCache | undefined;
            readonly memoryInfo?: Record<string, number> | undefined;
        }> | undefined;
        urlState?: {
            readonly sourceId: string;
            readonly parameters?: {
                readonly [x: string]: string | readonly string[];
            } | undefined;
        } | undefined;
        children?: import("react").ReactNode;
    }>, { args }: import("storybook/internal/csf").StoryContext<import("@storybook/react/dist/types-5617c98e").R, {
        name?: string | undefined;
        presence?: import("../players/types").PlayerPresence | undefined;
        topics?: import("../players/types").Topic[] | undefined;
        topicStats?: Map<string, import("../players/types").TopicStats> | undefined;
        datatypes?: import("../types/RosDatatypes").RosDatatypes | undefined;
        messages?: import("@lichtblick/suite").MessageEvent[] | undefined;
        alerts?: import("../players/types").PlayerAlert[] | undefined;
        publish?: ((request: import("../players/types").PublishPayload) => void) | undefined;
        callService?: ((service: string, request: unknown) => Promise<unknown>) | undefined;
        setPublishers?: ((arg0: string, arg1: import("../players/types").AdvertiseOptions[]) => void) | undefined;
        setSubscriptions?: ((arg0: string, arg1: readonly {
            readonly topic: string;
            readonly fields?: readonly string[] | undefined;
            readonly preloadType?: import("../players/types").SubscriptionPreloadType | undefined;
        }[]) => void) | undefined;
        setParameter?: ((key: string, value: import("@lichtblick/suite").ParameterValue) => void) | undefined;
        fetchAsset?: ((uri: string, options?: {
            signal?: AbortSignal | undefined;
            referenceUrl?: string | undefined;
        } | undefined) => Promise<import("./PanelExtensionAdapter").Asset>) | undefined;
        noActiveData?: boolean | undefined;
        activeData?: Partial<import("../players/types").PlayerStateActiveData> | undefined;
        capabilities?: string[] | undefined;
        profile?: string | undefined;
        startPlayback?: (() => void) | undefined;
        pausePlayback?: (() => void) | undefined;
        seekPlayback?: ((arg0: import("@lichtblick/rostime").Time) => void) | undefined;
        currentTime?: import("@lichtblick/rostime").Time | undefined;
        startTime?: import("@lichtblick/rostime").Time | undefined;
        endTime?: import("@lichtblick/rostime").Time | undefined;
        isPlaying?: boolean | undefined;
        pauseFrame?: ((arg0: string) => () => void) | undefined;
        playerId?: string | undefined;
        progress?: Readonly<{
            fullyLoadedFractionRanges?: import("../util/ranges").Range[] | undefined;
            readonly messageCache?: import("../players/types").BlockCache | undefined;
            readonly memoryInfo?: Record<string, number> | undefined;
        }> | undefined;
        urlState?: {
            readonly sourceId: string;
            readonly parameters?: {
                readonly [x: string]: string | readonly string[];
            } | undefined;
        } | undefined;
        children?: import("react").ReactNode;
    }>) => import("react/jsx-runtime").JSX.Element)[];
    play: () => Promise<void>;
};
export default _default;
type Story = StoryObj<typeof MockMessagePipelineProvider>;
export declare const WithoutSpeedCapability: Story;
export declare const WithoutASpeedFromThePlayer: Story;
export declare const WithASpeed: Story;
export declare const WithAVerySmallSpeed: Story;
