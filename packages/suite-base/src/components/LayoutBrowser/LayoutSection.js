import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Typography, List } from "@mui/material";
import Stack from "@lichtblick/suite-base/components/Stack";
import LayoutRow from "./LayoutRow";
export default function LayoutSection({ title, disablePadding = false, emptyText, items, anySelectedModifiedLayouts, multiSelectedIds, selectedId, onSelect, onRename, onDuplicate, onDelete, onShare, onExport, onOverwrite, onRevert, onMakePersonalCopy, }) {
    return (_jsxs(Stack, { children: [title != undefined && (_jsx(Stack, { paddingX: 2, paddingY: disablePadding ? 1 : 0, children: _jsx(Typography, { variant: "overline", color: "text.secondary", children: title }) })), _jsxs(List, { disablePadding: disablePadding, children: [items != undefined && items.length === 0 && (_jsx(Stack, { paddingX: 2, children: _jsx(Typography, { variant: "body2", color: "text.secondary", children: emptyText }) })), items?.map((layout) => (_jsx(LayoutRow, { anySelectedModifiedLayouts: anySelectedModifiedLayouts, multiSelectedIds: multiSelectedIds, selected: layout.id === selectedId, layout: layout, onSelect: onSelect, onRename: onRename, onDuplicate: onDuplicate, onDelete: onDelete, onShare: onShare, onExport: onExport, onOverwrite: onOverwrite, onRevert: onRevert, onMakePersonalCopy: onMakePersonalCopy }, layout.id)))] })] }));
}
