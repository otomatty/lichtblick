import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { ExperimentalFeatureSettings } from "@lichtblick/suite-base/components/ExperimentalFeatureSettings";
import AppConfigurationContext from "@lichtblick/suite-base/context/AppConfigurationContext";
import { makeMockAppConfiguration } from "@lichtblick/suite-base/util/makeMockAppConfiguration";
export default {
    title: "components/ExperimentalFeatureSettings",
    component: ExperimentalFeatureSettings,
};
export const Basic = {
    render: function Story() {
        const [config] = useState(() => makeMockAppConfiguration());
        return (_jsx(AppConfigurationContext.Provider, { value: config, children: _jsx(ExperimentalFeatureSettings, {}) }));
    },
};
