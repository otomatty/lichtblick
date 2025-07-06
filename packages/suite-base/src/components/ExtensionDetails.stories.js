import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { ExtensionDetails } from "@lichtblick/suite-base/components/ExtensionDetails";
import AppConfigurationContext from "@lichtblick/suite-base/context/AppConfigurationContext";
import ExtensionMarketplaceContext from "@lichtblick/suite-base/context/ExtensionMarketplaceContext";
import ExtensionCatalogProvider from "@lichtblick/suite-base/providers/ExtensionCatalogProvider";
import { makeMockAppConfiguration } from "@lichtblick/suite-base/util/makeMockAppConfiguration";
export default {
    title: "components/ExtensionDetails",
    component: ExtensionDetails,
};
const MockExtensionLoader = {
    namespace: "local",
    getExtension: async () => undefined,
    getExtensions: async () => [],
    loadExtension: async (_id) => "",
    installExtension: async (_foxeFileData) => {
        throw new Error("MockExtensionLoader cannot install extensions");
    },
    uninstallExtension: async (_id) => undefined,
};
const MockExtensionMarketplace = {
    getAvailableExtensions: async () => [],
    getMarkdown: async (url) => `# Markdown
Mock markdown rendering for URL [${url}](${url}).`,
};
const extension = {
    id: "publisher.storyextension",
    name: "Extension Name",
    description: "Extension sample description",
    qualifiedName: "Qualified Extension Name",
    publisher: "Publisher",
    homepage: "https://github.com/lichtblick-suite",
    license: "MIT",
    version: "1.2.10",
    keywords: ["storybook", "testing"],
    displayName: "Display Extension Name",
    time: {
        modified: "2021-05-19T21:37:40.166Z",
        created: "2012-04-17T00:38:04.350Z",
        "0.0.2": "2012-04-17T00:38:05.679Z",
        "2.1.0": "2021-05-19T21:37:38.037Z",
    },
};
export const Details = {
    render: function Story() {
        const [config] = useState(() => makeMockAppConfiguration());
        return (_jsx(AppConfigurationContext.Provider, { value: config, children: _jsx(ExtensionCatalogProvider, { loaders: [MockExtensionLoader], children: _jsx(ExtensionMarketplaceContext.Provider, { value: MockExtensionMarketplace, children: _jsx(ExtensionDetails, { extension: extension, onClose: () => { }, installed: false }) }) }) }));
    },
};
