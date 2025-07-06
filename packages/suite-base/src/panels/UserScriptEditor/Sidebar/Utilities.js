import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Stack from "@lichtblick/suite-base/components/Stack";
import { getUserScriptProjectConfig } from "@lichtblick/suite-base/players/UserScriptPlayer/transformerWorker/typescript/projectConfig";
import { SidebarHeader } from "./SidebarHeader";
const { utilityFiles } = getUserScriptProjectConfig();
export function Utilities({ onClose, gotoUtils, script, }) {
    return (_jsxs(Stack, { flex: "auto", position: "relative", children: [_jsx(SidebarHeader, { onClose: onClose, title: "Utilities", subheader: _jsxs(_Fragment, { children: ["You can import any of these modules into your script using the following syntax:", " ", _jsx("pre", { children: `import { ... } from "./pointClouds.ts".` })] }) }), _jsxs(List, { dense: true, children: [utilityFiles.map(({ fileName, filePath }) => (_jsx(ListItem, { disablePadding: true, onClick: gotoUtils.bind(undefined, filePath), children: _jsx(ListItemButton, { selected: script ? filePath === script.filePath : undefined, children: _jsx(ListItemText, { primary: fileName, primaryTypographyProps: { variant: "body2" } }) }) }, filePath))), _jsx(ListItem, { disablePadding: true, onClick: gotoUtils.bind(undefined, "/studio_script/generatedTypes.ts"), children: _jsx(ListItemButton, { selected: script ? script.filePath === "/studio_script/generatedTypes.ts" : undefined, children: _jsx(ListItemText, { primary: "generatedTypes.ts" }) }) })] })] }));
}
