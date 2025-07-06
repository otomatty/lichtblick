import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import ExtensionsSettings from "@lichtblick/suite-base/components/ExtensionsSettings";
import AppConfigurationContext from "@lichtblick/suite-base/context/AppConfigurationContext";
import ExtensionMarketplaceContext from "@lichtblick/suite-base/context/ExtensionMarketplaceContext";
import ExtensionCatalogProvider from "@lichtblick/suite-base/providers/ExtensionCatalogProvider";
import { makeMockAppConfiguration } from "@lichtblick/suite-base/util/makeMockAppConfiguration";
export default {
    title: "components/ExtensionsSettings",
    component: ExtensionsSettings,
};
const installedExtensions = [
    {
        id: "publisher.storyextension",
        name: "privatestoryextension",
        qualifiedName: "storyextension",
        displayName: "Private Extension Name",
        description: "Private extension sample description",
        publisher: "Private Publisher",
        homepage: "https://github.com/lichtblick-suite",
        license: "MIT",
        version: "1.2.10",
        keywords: ["storybook", "testing"],
        namespace: "org",
        readme: "Readme for extension",
        changelog: "Changes effectuated on extension",
    },
    {
        id: "publisher.storyextension",
        name: "storyextension",
        qualifiedName: "storyextension",
        displayName: "Extension Name",
        description: "Extension sample description",
        publisher: "Publisher",
        homepage: "https://github.com/lichtblick-suite",
        license: "MIT",
        version: "1.2.10",
        keywords: ["storybook", "testing"],
        namespace: "local",
        readme: "Readme for extension",
        changelog: "Changes effectuated on extension",
    },
];
const marketplaceExtensions = [
    {
        id: "publisher.storyextension",
        name: "storyextension",
        qualifiedName: "storyextension",
        displayName: "Extension Name",
        description: "Extension sample description",
        publisher: "Publisher",
        homepage: "https://github.com/lichtblick-suite",
        license: "MIT",
        version: "1.2.10",
        keywords: ["storybook", "testing"],
        readme: "Readme for extension",
        changelog: "Changes effectuated on extension",
    },
];
const MockExtensionLoader = {
    namespace: "local",
    getExtension: async () => installedExtensions[0],
    getExtensions: async () => installedExtensions,
    loadExtension: async (_id) => "",
    installExtension: async (_foxeFileData) => {
        throw new Error("MockExtensionLoader cannot install extensions");
    },
    uninstallExtension: async (_id) => undefined,
};
const MockExtensionMarketplace = {
    getAvailableExtensions: async () => marketplaceExtensions,
    getMarkdown: async (url) => `# Markdown
Mock markdown rendering for URL [${url}](${url}).`,
};
export const Sidebar = {
    render: function Story() {
        const [config] = useState(() => makeMockAppConfiguration());
        return (_jsx(AppConfigurationContext.Provider, { value: config, children: _jsx(ExtensionCatalogProvider, { loaders: [MockExtensionLoader], children: _jsx(ExtensionMarketplaceContext.Provider, { value: MockExtensionMarketplace, children: _jsx(ExtensionsSettings, {}) }) }) }));
    },
};
export const WithoutNetwork = {
    render: function Story() {
        const [config] = useState(() => makeMockAppConfiguration());
        const marketPlace = {
            ...MockExtensionMarketplace,
            getAvailableExtensions: () => {
                throw new Error("offline");
            },
        };
        return (_jsx(AppConfigurationContext.Provider, { value: config, children: _jsx(ExtensionCatalogProvider, { loaders: [MockExtensionLoader], children: _jsx(ExtensionMarketplaceContext.Provider, { value: marketPlace, children: _jsx(ExtensionsSettings, {}) }) }) }));
    },
};
