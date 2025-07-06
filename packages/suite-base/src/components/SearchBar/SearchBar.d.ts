import { TextFieldProps } from "@mui/material/TextField";
import { PropsWithChildren } from "react";
declare function SearchBar(props: PropsWithChildren<TextFieldProps & {
    onClear?: () => void;
    showClearIcon?: boolean;
    startAdornment?: React.ReactNode;
}>): React.JSX.Element;
export default SearchBar;
