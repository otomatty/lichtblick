/// <reference types="react" />
import { Immutable } from "@lichtblick/suite";
import { ExtensionMarketplaceDetail } from "@lichtblick/suite-base/context/ExtensionMarketplaceContext";
type Props = {
    entry: Immutable<ExtensionMarketplaceDetail>;
    onClick: () => void;
    searchText: string;
};
export default function ExtensionListEntry({ entry: { id, description, name, publisher, version }, searchText, onClick, }: Props): React.JSX.Element;
export {};
