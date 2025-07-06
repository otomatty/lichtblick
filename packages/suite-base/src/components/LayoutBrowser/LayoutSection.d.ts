import { MouseEvent } from "react";
import { Layout } from "@lichtblick/suite-base/services/ILayoutStorage";
export default function LayoutSection({ title, disablePadding, emptyText, items, anySelectedModifiedLayouts, multiSelectedIds, selectedId, onSelect, onRename, onDuplicate, onDelete, onShare, onExport, onOverwrite, onRevert, onMakePersonalCopy, }: {
    title: string | undefined;
    disablePadding?: boolean;
    emptyText: string | undefined;
    items: readonly Layout[] | undefined;
    anySelectedModifiedLayouts: boolean;
    multiSelectedIds: readonly string[];
    selectedId?: string;
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
}): React.JSX.Element;
