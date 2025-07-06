import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import { IconButton, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useCallback } from "react";
import PublishPointIcon from "@lichtblick/suite-base/components/PublishPointIcon";
import { useStyles } from "@lichtblick/suite-base/panels/DiagnosticSummary/DiagnosticSummary.style";
import { MESSAGE_COLORS } from "@lichtblick/suite-base/panels/DiagnosticSummary/constants";
function DiagnosticNodeRow(props) {
    const { info, isPinned, onClick, onClickPin } = props;
    const { classes } = useStyles();
    const handleClick = useCallback(() => {
        onClick(info);
    }, [onClick, info]);
    const handleClickPin = useCallback(() => {
        onClickPin(info);
    }, [onClickPin, info]);
    return (_jsx(ListItem, { dense: true, disablePadding: true, "data-testid": "diagnostic-row", children: _jsxs(ListItemButton, { className: classes.listItemButton, disableGutters: true, onClick: handleClick, "data-testid": "diagnostic-row-button", children: [_jsx(IconButton, { size: "small", onClick: (event) => {
                        handleClickPin();
                        event.stopPropagation();
                    }, style: isPinned ? { visibility: "visible" } : undefined, "data-testid": "diagnostic-row-icon", children: _jsx(PublishPointIcon, { fontSize: "small", color: isPinned ? "inherit" : "disabled" }) }), _jsx(ListItemText, { primary: info.displayName, secondary: info.status.message, secondaryTypographyProps: {
                        color: MESSAGE_COLORS[info.status.level],
                    }, style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } })] }) }));
}
export default React.memo(DiagnosticNodeRow);
