import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useSessionStorageValue } from "@lichtblick/hooks";
import { LaunchPreferenceValue } from "@lichtblick/suite-base/types/LaunchPreferenceValue";
import { LaunchPreferenceScreen } from "./LaunchPreferenceScreen";
import { LaunchingInDesktopScreen } from "./LaunchingInDesktopScreen";
import { AppSetting } from "../AppSetting";
import { useAppConfigurationValue } from "../hooks";
export function LaunchPreference(props) {
    const [globalLaunchPreference] = useAppConfigurationValue(AppSetting.LAUNCH_PREFERENCE);
    const [sessionLaunchPreference] = useSessionStorageValue(AppSetting.LAUNCH_PREFERENCE);
    const url = new URL(window.location.href);
    // Session preferences take priority over URL and global preferences. This allows the button in
    // LaunchPreferenceScreen to override the url when clicked.
    let activePreference = sessionLaunchPreference ?? url.searchParams.get("openIn") ?? globalLaunchPreference;
    switch (activePreference) {
        case LaunchPreferenceValue.WEB:
        case LaunchPreferenceValue.DESKTOP:
        case LaunchPreferenceValue.ASK:
            break;
        case undefined:
        default:
            activePreference = LaunchPreferenceValue.WEB;
    }
    const hasParams = Array.from(url.searchParams.entries()).length > 0;
    // Ask the user in which environment they want to open this session.
    if (activePreference === LaunchPreferenceValue.ASK && hasParams) {
        return _jsx(LaunchPreferenceScreen, {});
    }
    else if (activePreference === LaunchPreferenceValue.DESKTOP && hasParams) {
        return _jsx(LaunchingInDesktopScreen, {});
    }
    else {
        return _jsx(_Fragment, { children: props.children });
    }
}
