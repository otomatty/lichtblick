import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useLayoutEffect } from "react";
import { action } from "storybook/actions";
import MockMessagePipelineProvider from "@lichtblick/suite-base/components/MessagePipeline/MockMessagePipelineProvider";
import AppConfigurationContext from "@lichtblick/suite-base/context/AppConfigurationContext";
import { useEvents } from "@lichtblick/suite-base/context/EventsContext";
import { useSetHoverValue } from "@lichtblick/suite-base/context/TimelineInteractionStateContext";
import { PLAYER_CAPABILITIES } from "@lichtblick/suite-base/players/constants";
import { PlayerPresence, } from "@lichtblick/suite-base/players/types";
import MockCurrentLayoutProvider from "@lichtblick/suite-base/providers/CurrentLayoutProvider/MockCurrentLayoutProvider";
import EventsProvider from "@lichtblick/suite-base/providers/EventsProvider";
import WorkspaceContextProvider from "@lichtblick/suite-base/providers/WorkspaceContextProvider";
import { makeMockEvents } from "@lichtblick/suite-base/test/mocks/makeMockEvents";
import PlaybackControls from "./index";
const START_TIME = 1531761690;
function getPlayerState() {
    const player = {
        presence: PlayerPresence.PRESENT,
        progress: {},
        capabilities: [PLAYER_CAPABILITIES.setSpeed, PLAYER_CAPABILITIES.playbackControl],
        profile: undefined,
        playerId: "1",
        activeData: {
            messages: [],
            startTime: { sec: START_TIME, nsec: 331 },
            endTime: { sec: START_TIME + 20, nsec: 331 },
            currentTime: { sec: START_TIME + 5, nsec: 331 },
            isPlaying: true,
            speed: 0.2,
            lastSeekTime: 0,
            topics: [{ name: "/empty_topic", schemaName: "VoidType" }],
            topicStats: new Map(),
            datatypes: new Map(Object.entries({ VoidType: { definitions: [] } })),
            totalBytesReceived: 1234,
        },
    };
    return player;
}
const mockAppConfiguration = {
    get: (key) => {
        if (key === "timezone") {
            return "America/Los_Angeles";
        }
        else {
            return undefined;
        }
    },
    set: async () => { },
    addChangeListener: () => { },
    removeChangeListener: () => { },
};
function Wrapper({ isPlaying = false, activeData, children, progress, presence, noActiveData, }) {
    return (_jsx(MockMessagePipelineProvider, { isPlaying: isPlaying, capabilities: ["setSpeed", "playbackControl"], presence: presence, activeData: activeData, pausePlayback: action("pause"), seekPlayback: action("seek"), startPlayback: action("play"), progress: progress, noActiveData: noActiveData, children: _jsx("div", { style: { padding: 20, margin: 20 }, children: children }) }));
}
export default {
    title: "components/PlaybackControls",
    decorators: [
        (Wrapped) => (_jsx(AppConfigurationContext.Provider, { value: mockAppConfiguration, children: _jsx(WorkspaceContextProvider, { children: _jsx(MockCurrentLayoutProvider, { children: _jsx(EventsProvider, { children: _jsx(Wrapped, {}) }) }) }) })),
    ],
};
export const Playing = {
    render: () => {
        return (_jsx(Wrapper, { isPlaying: true, children: _jsx(PlaybackControls, { isPlaying: true, getTimeInfo: () => ({}), play: action("play"), pause: action("pause"), seek: action("seek") }) }));
    },
    parameters: { colorScheme: "both-column" },
};
export const Paused = {
    render: () => {
        return (_jsx(Wrapper, { children: _jsx(PlaybackControls, { isPlaying: false, getTimeInfo: () => ({}), play: action("play"), pause: action("pause"), seek: action("seek") }) }));
    },
    parameters: { colorScheme: "both-column" },
};
export const Disabled = {
    render: () => {
        return (_jsx(Wrapper, { presence: PlayerPresence.ERROR, noActiveData: true, children: _jsx(PlaybackControls, { isPlaying: false, getTimeInfo: () => ({}), play: action("play"), pause: action("pause"), seek: action("seek") }) }));
    },
    parameters: { colorScheme: "both-column" },
};
export const DownloadProgressByRanges = {
    render: () => {
        const player = getPlayerState();
        player.progress = {
            ...player.progress,
            fullyLoadedFractionRanges: [
                { start: -2, end: 0.1 },
                { start: 0.23, end: 0.6 },
                { start: 0.7, end: 1 },
            ],
        };
        return (_jsx(Wrapper, { progress: player.progress, children: _jsx(PlaybackControls, { isPlaying: true, getTimeInfo: () => ({}), play: action("play"), pause: action("pause"), seek: action("seek") }) }));
    },
    parameters: { colorScheme: "both-column" },
};
export const HoverTicks = {
    render: function Story() {
        const player = getPlayerState();
        const setHoverValue = useSetHoverValue();
        useLayoutEffect(() => {
            setHoverValue({
                type: "PLAYBACK_SECONDS",
                value: 0.5,
                componentId: "story",
            });
        }, [setHoverValue]);
        return (_jsx(Wrapper, { activeData: player.activeData, children: _jsx(PlaybackControls, { isPlaying: true, getTimeInfo: () => ({}), play: action("play"), pause: action("pause"), seek: action("seek") }) }));
    },
    parameters: { colorScheme: "both-column" },
};
export const WithEvents = {
    render: function Story() {
        const player = getPlayerState();
        const setEvents = useEvents((store) => store.setEvents);
        useEffect(() => {
            setEvents({ loading: false, value: makeMockEvents(4, START_TIME + 1, 4) });
        });
        return (_jsx(Wrapper, { activeData: player.activeData, children: _jsx(PlaybackControls, { isPlaying: true, getTimeInfo: () => ({}), play: action("play"), pause: action("pause"), seek: action("seek") }) }));
    },
    parameters: { colorScheme: "both-column" },
};
