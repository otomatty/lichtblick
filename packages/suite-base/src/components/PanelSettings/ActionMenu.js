import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStyles } from "@lichtblick/suite-base/components/PanelSettings/ActionMenu.style";
export function ActionMenu({ allowShare, onReset, onShare, fontSize = "medium", }) {
    const { classes, cx } = useStyles();
    const [anchorEl, setAnchorEl] = useState();
    const { t } = useTranslation("panelSettings");
    const [isMenuOpen, setMenuOpen] = useState(false);
    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setAnchorEl(undefined);
        setMenuOpen(false);
    }, []);
    const handleShare = useCallback(() => {
        onShare();
        handleClose();
    }, [onShare, handleClose]);
    const handleReset = useCallback(() => {
        onReset();
        handleClose();
    }, [onReset, handleClose]);
    return (_jsxs("div", { children: [_jsx(IconButton, { className: cx({ [classes.iconButtonSmall]: fontSize === "small" }), "data-testid": "basic-button", id: "basic-button", "aria-controls": isMenuOpen ? "basic-menu" : undefined, "aria-haspopup": "true", "aria-expanded": isMenuOpen ? "true" : undefined, onClick: handleClick, children: _jsx(MoreVertIcon, { fontSize: fontSize }) }), _jsxs(Menu, { "data-testid": "basic-menu", id: "basic-menu", anchorEl: anchorEl, open: isMenuOpen, onClose: handleClose, MenuListProps: {
                    "aria-labelledby": "basic-button",
                }, children: [_jsx(MenuItem, { disabled: !allowShare, "aria-disabled": !allowShare, onClick: handleShare, children: t("importOrExportSettingsWithEllipsis") }), _jsx(MenuItem, { onClick: handleReset, children: t("resetToDefaults") })] })] }));
}
