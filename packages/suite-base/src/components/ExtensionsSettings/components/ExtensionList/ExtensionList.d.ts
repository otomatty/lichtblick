/// <reference types="react" />
import { Immutable } from "@lichtblick/suite";
import { FocusedExtension } from "@lichtblick/suite-base/components/ExtensionsSettings/types";
import { ExtensionMarketplaceDetail } from "@lichtblick/suite-base/context/ExtensionMarketplaceContext";
export declare function displayNameForNamespace(namespace: string): string;
export declare function generatePlaceholderList(message?: string): React.ReactElement;
type ExtensionListProps = {
    namespace: string;
    entries: Immutable<ExtensionMarketplaceDetail>[];
    filterText: string;
    selectExtension: (newFocusedExtension: FocusedExtension) => void;
};
export default function ExtensionList({ namespace, entries, filterText, selectExtension, }: ExtensionListProps): React.JSX.Element;
export {};
