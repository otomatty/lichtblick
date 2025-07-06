import { jsx as _jsx } from "react/jsx-runtime";
import PanelSetup from "@lichtblick/suite-base/stories/PanelSetup";
import PlaybackPerformance from "./index";
export default {
    title: "panels/PlaybackPerformance",
};
export const SimpleExample = {
    render: () => {
        return (_jsx(PanelSetup, { children: _jsx(PlaybackPerformance, {}) }));
    },
};
