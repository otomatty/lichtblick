import { ExtensionMarketplaceDetail } from "@lichtblick/suite-base/context/ExtensionMarketplaceContext";
import { ExtensionInfo } from "@lichtblick/suite-base/types/Extensions";
export default class ExtensionBuilder {
    static extensionInfo(props?: Partial<ExtensionInfo>): ExtensionInfo;
    static extensionMarketplaceDetail(props?: Partial<ExtensionMarketplaceDetail>): ExtensionMarketplaceDetail;
}
