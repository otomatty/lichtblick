import { MouseEvent } from "react";
import { Layout } from "@lichtblick/suite-base/services/ILayoutStorage";
declare const _default: import("react").NamedExoticComponent<{
    layout: Layout;
    anySelectedModifiedLayouts: boolean;
    multiSelectedIds: readonly string[];
    selected: boolean;
    onSelect: (item: Layout, params?: {
        selectedViaClick?: boolean;
        event?: MouseEvent;
    }) => void;
    onRename: (item: Layout, newName: string) => void;
    onDuplicate: (item: Layout) => void;
    onDelete: (item: Layout) => void;
    onShare: (item: Layout) => void;
    onExport: (item: Layout) => void;
    onOverwrite: (item: Layout) => void;
    onRevert: (item: Layout) => void;
    onMakePersonalCopy: (item: Layout) => void;
}>;
export default _default;
