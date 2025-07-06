import { jsx as _jsx } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, TextField, InputAdornment } from "@mui/material";
import { useStyles } from "@lichtblick/suite-base/components/SearchBar/SearchBar.style";
function SearchBar(props) {
    const { id = "search-bar", variant = "filled", disabled = false, value, onChange, onClear, showClearIcon = false, startAdornment = _jsx(SearchIcon, { fontSize: "small", "data-testid": "SearchIcon" }), ...rest } = props;
    const { classes } = useStyles();
    return (_jsx("div", { className: classes.filterSearchBar, children: _jsx(TextField, { "data-testid": "SearchBarComponent", id: id, variant: variant, disabled: disabled, value: value, onChange: onChange, fullWidth: true, InputProps: {
                ...rest.InputProps,
                startAdornment: (_jsx(InputAdornment, { className: classes.filterStartAdornment, position: "start", children: startAdornment })),
                endAdornment: showClearIcon && (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { size: "small", title: "Clear", onClick: onClear, edge: "end", children: _jsx(ClearIcon, { fontSize: "small", "data-testid": "ClearIcon" }) }) })),
            }, ...rest }) }));
}
export default SearchBar;
