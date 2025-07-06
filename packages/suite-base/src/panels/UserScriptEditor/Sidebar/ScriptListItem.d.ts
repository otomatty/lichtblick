/// <reference types="react" />
export declare function ScriptListItem({ onClick, onDelete, onRename, title, selected, }: {
    onClick: () => void;
    onDelete: () => void;
    onRename: (name: string) => void;
    title: string;
    selected?: boolean;
}): React.JSX.Element;
