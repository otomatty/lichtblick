import { CSSProperties, PropsWithChildren } from "react";
export declare function SidebarContent({ disablePadding, disableToolbar, title, children, leadingItems, overflow, trailingItems, }: PropsWithChildren<SidebarContentProps>): React.JSX.Element;
type SidebarContentProps = {
    title?: string;
    disablePadding?: boolean;
    disableToolbar?: boolean;
    /** Buttons/items to display on the leading (left) side of the header */
    leadingItems?: React.ReactNode[];
    /** Overflow style of root element
     * @default: "auto"
     */
    overflow?: CSSProperties["overflow"];
    /** Buttons/items to display on the trailing (right) side of the header */
    trailingItems?: React.ReactNode[];
};
export {};
