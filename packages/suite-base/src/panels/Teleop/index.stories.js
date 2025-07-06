import { jsx as _jsx } from "react/jsx-runtime";
import { action } from "storybook/actions";
import { PLAYER_CAPABILITIES } from "@lichtblick/suite-base/players/constants";
import PanelSetup from "@lichtblick/suite-base/stories/PanelSetup";
import TeleopPanel from "./index";
export default {
    title: "panels/Teleop",
    component: TeleopPanel,
    decorators: [
        (StoryComponent, context) => {
            return (_jsx(PanelSetup, { fixture: { capabilities: [PLAYER_CAPABILITIES.advertise], publish: action("publish") }, includeSettings: context.parameters.includeSettings, children: _jsx(StoryComponent, {}) }));
        },
    ],
};
export const Unconfigured = {
    render: () => {
        return _jsx(TeleopPanel, {});
    },
};
export const WithSettings = {
    render: function Story() {
        return _jsx(TeleopPanel, { overrideConfig: { topic: "/abc" } });
    },
    parameters: {
        colorScheme: "light",
        includeSettings: true,
    },
};
export const WithTopic = {
    render: () => {
        return _jsx(TeleopPanel, { overrideConfig: { topic: "/abc" } });
    },
};
