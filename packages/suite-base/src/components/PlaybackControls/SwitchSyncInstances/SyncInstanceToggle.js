import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { Stack, Button, Typography } from "@mui/material";
import { AppSetting } from "@lichtblick/suite-base/AppSetting";
import { useWorkspaceStore } from "@lichtblick/suite-base/context/Workspace/WorkspaceContext";
import { useWorkspaceActions } from "@lichtblick/suite-base/context/Workspace/useWorkspaceActions";
import { useAppConfigurationValue } from "@lichtblick/suite-base/hooks";
import { useStyles } from "./SyncInstanceToggle.style";
const SyncInstanceToggle = () => {
    const [enableSyncLBInstances = false] = useAppConfigurationValue(AppSetting.SHOW_SYNC_LB_INSTANCES);
    const syncInstances = useWorkspaceStore((store) => store.playbackControls.syncInstances);
    const { playbackControlActions: { setSyncInstances }, } = useWorkspaceActions();
    const { classes } = useStyles({ syncInstances });
    if (!enableSyncLBInstances) {
        // Turn off sync if experimental feature is turned off
        if (syncInstances) {
            setSyncInstances(false);
        }
        return _jsx(_Fragment, {});
    }
    const handleToogle = () => {
        setSyncInstances(!syncInstances);
    };
    return (_jsx(Button, { className: classes.button, onClick: handleToogle, children: _jsxs(Stack, { className: classes.textWrapper, children: [_jsx(Typography, { className: classes.syncText, children: "Sync" }), _jsx(Typography, { className: classes.onOffText, children: syncInstances ? "on" : "off" })] }) }));
};
export default SyncInstanceToggle;
