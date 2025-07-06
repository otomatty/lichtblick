/// <reference types="react" />
import { Immutable } from "@lichtblick/suite";
import { ExtensionMarketplaceDetail } from "@lichtblick/suite-base/context/ExtensionMarketplaceContext";
type Props = {
    installed: boolean;
    extension: Immutable<ExtensionMarketplaceDetail>;
    onClose: () => void;
};
/**
 * ExtensionDetails component displays detailed information about a specific extension.
 * It allows users to install, uninstall, and view the README and CHANGELOG of the extension.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.installed - Indicates if the extension is already installed.
 * @param {Immutable<ExtensionMarketplaceDetail>} props.extension - The extension details.
 * @param {Function} props.onClose - Callback function to close the details view.
 * @returns {React.ReactElement} The rendered component.
 */
export declare function ExtensionDetails({ extension, onClose, installed, }: Readonly<Props>): React.ReactElement;
export {};
