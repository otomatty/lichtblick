import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import ErrorIcon from "@mui/icons-material/Error";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Divider, IconButton, ListItemButton, ListItemText, Menu, MenuItem, SvgIcon, TextField, Typography, } from "@mui/material";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, } from "react";
import { useMountedState } from "react-use";
import { useLayoutManager } from "@lichtblick/suite-base/context/LayoutManagerContext";
import { useConfirm } from "@lichtblick/suite-base/hooks/useConfirm";
import { layoutIsShared } from "@lichtblick/suite-base/services/ILayoutStorage";
import { StyledListItem, StyledMenuItem } from "./LayoutRow.style";
export default React.memo(function LayoutRow({ layout, anySelectedModifiedLayouts, multiSelectedIds, selected, onSelect, onRename, onDuplicate, onDelete, onShare, onExport, onOverwrite, onRevert, onMakePersonalCopy, }) {
    const isMounted = useMountedState();
    const [confirm, confirmModal] = useConfirm();
    const layoutManager = useLayoutManager();
    const [editingName, setEditingName] = useState(false);
    const [nameFieldValue, setNameFieldValue] = useState("");
    const [isOnline, setIsOnline] = useState(layoutManager.isOnline);
    const [contextMenuTarget, setContextMenuTarget] = useState(undefined);
    const deletedOnServer = layout.syncInfo?.status === "remotely-deleted";
    const hasModifications = layout.working != undefined;
    const multiSelection = multiSelectedIds.length > 1;
    useLayoutEffect(() => {
        const onlineListener = () => {
            setIsOnline(layoutManager.isOnline);
        };
        onlineListener();
        layoutManager.on("onlinechange", onlineListener);
        return () => {
            layoutManager.off("onlinechange", onlineListener);
        };
    }, [layoutManager]);
    const overwriteAction = useCallback(() => {
        onOverwrite(layout);
    }, [layout, onOverwrite]);
    const confirmRevert = useCallback(async () => {
        const response = await confirm({
            title: multiSelection ? `Revert layouts` : `Revert “${layout.name}”?`,
            prompt: "Your changes will be permantly discarded. This cannot be undone.",
            ok: "Discard changes",
            variant: "danger",
        });
        if (response !== "ok") {
            return;
        }
        onRevert(layout);
    }, [confirm, layout, multiSelection, onRevert]);
    const makePersonalCopyAction = useCallback(() => {
        onMakePersonalCopy(layout);
    }, [layout, onMakePersonalCopy]);
    const renameAction = useCallback(() => {
        setNameFieldValue(layout.name);
        setEditingName(true);
    }, [layout]);
    const onClick = useCallback((event) => {
        onSelect(layout, { selectedViaClick: true, event });
    }, [layout, onSelect]);
    const duplicateAction = useCallback(() => {
        onDuplicate(layout);
    }, [layout, onDuplicate]);
    const shareAction = useCallback(() => {
        onShare(layout);
    }, [layout, onShare]);
    const exportAction = useCallback(() => {
        onExport(layout);
    }, [layout, onExport]);
    const onSubmit = useCallback((event) => {
        event.preventDefault();
        if (!editingName) {
            return;
        }
        const newName = nameFieldValue;
        if (newName && newName !== layout.name) {
            onRename(layout, newName);
        }
        setEditingName(false);
    }, [editingName, layout, nameFieldValue, onRename]);
    const onTextFieldKeyDown = useCallback((event) => {
        if (event.key === "Escape") {
            setEditingName(false);
        }
    }, []);
    const onBlur = useCallback((event) => {
        onSubmit(event);
    }, [onSubmit]);
    const nameInputRef = useRef(ReactNull);
    const confirmDelete = useCallback(() => {
        const layoutWarning = !multiSelection && layoutIsShared(layout)
            ? "Organization members will no longer be able to access this layout. "
            : "";
        const prompt = `${layoutWarning}This action cannot be undone.`;
        const title = multiSelection ? "Delete selected layouts?" : `Delete “${layout.name}”?`;
        void confirm({
            title,
            prompt,
            ok: "Delete",
            variant: "danger",
        }).then((response) => {
            if (response === "ok" && isMounted()) {
                onDelete(layout);
            }
        });
    }, [confirm, isMounted, layout, multiSelection, onDelete]);
    const handleContextMenu = useCallback((event) => {
        event.preventDefault();
        setContextMenuTarget((target) => target == undefined
            ? { type: "position", mouseX: event.clientX, mouseY: event.clientY }
            : undefined);
    }, []);
    const handleMenuButtonClick = useCallback((event) => {
        event.preventDefault();
        const { currentTarget } = event;
        setContextMenuTarget((target) => target == undefined ? { type: "element", element: currentTarget } : undefined);
    }, []);
    const handleClose = useCallback(() => {
        setContextMenuTarget(undefined);
    }, []);
    const menuItems = [
        {
            type: "item",
            key: "rename",
            text: "Rename",
            onClick: renameAction,
            "data-testid": "rename-layout",
            disabled: (layoutIsShared(layout) && !isOnline) || multiSelection,
            secondaryText: layoutIsShared(layout) && !isOnline ? "Offline" : undefined,
        },
        // For shared layouts, duplicate first requires saving or discarding changes
        !(layoutIsShared(layout) && hasModifications) && {
            type: "item",
            key: "duplicate",
            text: layoutManager.supportsSharing && layoutIsShared(layout)
                ? "Make a personal copy"
                : "Duplicate",
            onClick: duplicateAction,
            "data-testid": "duplicate-layout",
        },
        layoutManager.supportsSharing &&
            !layoutIsShared(layout) && {
            type: "item",
            key: "share",
            text: "Share with team…",
            onClick: shareAction,
            disabled: !isOnline || multiSelection,
            secondaryText: !isOnline ? "Offline" : undefined,
        },
        {
            type: "item",
            key: "export",
            text: "Export…",
            disabled: multiSelection,
            onClick: exportAction,
        },
        { key: "divider_1", type: "divider" },
        {
            type: "item",
            key: "delete",
            text: "Delete",
            onClick: confirmDelete,
            "data-testid": "delete-layout",
        },
    ];
    if (hasModifications) {
        const sectionItems = [
            {
                type: "item",
                key: "overwrite",
                text: "Save changes",
                onClick: overwriteAction,
                disabled: deletedOnServer || (layoutIsShared(layout) && !isOnline),
                secondaryText: layoutIsShared(layout) && !isOnline ? "Offline" : undefined,
            },
            {
                type: "item",
                key: "revert",
                text: "Revert",
                onClick: confirmRevert,
                disabled: deletedOnServer,
            },
        ];
        if (layoutIsShared(layout)) {
            sectionItems.push({
                type: "item",
                key: "copy_to_personal",
                text: "Make a personal copy",
                disabled: multiSelection,
                onClick: makePersonalCopyAction,
            });
        }
        const unsavedChangesMessage = anySelectedModifiedLayouts
            ? "These layouts have unsaved changes"
            : "This layout has unsaved changes";
        menuItems.unshift({
            key: "changes",
            type: "header",
            text: deletedOnServer ? "Someone else has deleted this layout" : unsavedChangesMessage,
        }, ...sectionItems, { key: "changes_divider", type: "divider" });
    }
    const filteredItems = menuItems.filter((item) => typeof item === "object");
    const actionIcon = useMemo(() => deletedOnServer ? (_jsx(ErrorIcon, { fontSize: "small", color: "error" })) : hasModifications ? (_jsx(SvgIcon, { fontSize: "small", color: "primary", children: _jsx("circle", { cx: 12, cy: 12, r: 4 }) })) : (_jsx(MoreVertIcon, { fontSize: "small" })), [deletedOnServer, hasModifications]);
    useEffect(() => {
        if (editingName) {
            nameInputRef.current?.focus();
            nameInputRef.current?.select();
        }
    }, [editingName]);
    return (_jsxs(StyledListItem, { editingName: editingName, hasModifications: hasModifications, deletedOnServer: deletedOnServer, disablePadding: true, secondaryAction: _jsx(IconButton, { "data-testid": "layout-actions", "aria-controls": contextMenuTarget != undefined ? "layout-action-menu" : undefined, "aria-haspopup": "true", "aria-expanded": contextMenuTarget != undefined ? "true" : undefined, onClick: handleMenuButtonClick, onContextMenu: handleContextMenu, children: actionIcon }), children: [confirmModal, _jsx(ListItemButton, { "data-testid": "layout-list-item", selected: selected || multiSelectedIds.includes(layout.id), onSubmit: onSubmit, onClick: editingName ? undefined : onClick, onContextMenu: editingName ? undefined : handleContextMenu, component: "form", children: _jsxs(ListItemText, { disableTypography: true, children: [_jsx(TextField, { inputRef: nameInputRef, value: nameFieldValue, onChange: (event) => {
                                setNameFieldValue(event.target.value);
                            }, onKeyDown: onTextFieldKeyDown, onBlur: onBlur, fullWidth: true, style: {
                                font: "inherit",
                                display: editingName ? "inline" : "none",
                            }, size: "small", variant: "filled" }), _jsx(Typography, { component: "span", variant: "inherit", color: "inherit", noWrap: true, style: { display: editingName ? "none" : "block" }, children: layout.name })] }) }), _jsx(Menu, { id: "layout-action-menu", open: contextMenuTarget != undefined, disableAutoFocus: true, disableRestoreFocus: true, anchorReference: contextMenuTarget?.type === "position" ? "anchorPosition" : "anchorEl", anchorPosition: contextMenuTarget?.type === "position"
                    ? { top: contextMenuTarget.mouseY, left: contextMenuTarget.mouseX }
                    : undefined, anchorEl: contextMenuTarget?.element, onClose: handleClose, MenuListProps: {
                    "aria-labelledby": "layout-actions",
                    dense: true,
                }, children: filteredItems.map((item) => {
                    switch (item.type) {
                        case "divider":
                            return _jsx(Divider, { variant: "middle" }, item.key);
                        case "item":
                            return (_jsx(StyledMenuItem, { debug: item.debug, disabled: item.disabled, "data-testid": item["data-testid"], onClick: (event) => {
                                    item.onClick?.(event);
                                    handleClose();
                                }, children: _jsx(Typography, { variant: "inherit", color: item.key === "delete" ? "error" : undefined, children: item.text }) }, item.key));
                        case "header":
                            return (_jsx(MenuItem, { disabled: true, children: item.text }, item.key));
                        default:
                            return undefined;
                    }
                }) })] }));
});
