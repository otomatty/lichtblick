import { jsx as _jsx } from "react/jsx-runtime";
import { screen, userEvent } from "@storybook/testing-library";
import * as _ from "lodash-es";
import ExtensionMarketplaceContext from "@lichtblick/suite-base/context/ExtensionMarketplaceContext";
import ExtensionCatalogProvider from "@lichtblick/suite-base/providers/ExtensionCatalogProvider";
import WorkspaceContextProvider from "@lichtblick/suite-base/providers/WorkspaceContextProvider";
import { AppSettingsDialog } from "./AppSettingsDialog";
const installedExtensions = _.range(1, 10).map((index) => ({
    id: "publisher.storyextension",
    name: "privatestoryextension",
    qualifiedName: "storyextension",
    displayName: `Private Extension Name ${index + 1}`,
    description: "Private extension sample description",
    publisher: "Private Publisher",
    homepage: "https://github.com/lichtblick-suite",
    license: "MIT",
    version: `1.${index}`,
    keywords: ["storybook", "testing"],
    namespace: index % 2 === 0 ? "local" : "org",
    readme: "Readme for extension",
    changelog: "Changes effectuated on extension",
}));
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
        readme: "Information about extension",
        changelog: "Some changes on extension",
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
function Wrapper(StoryComponent) {
    return (_jsx(WorkspaceContextProvider, { children: _jsx(ExtensionCatalogProvider, { loaders: [MockExtensionLoader], children: _jsx(ExtensionMarketplaceContext.Provider, { value: MockExtensionMarketplace, children: _jsx(StoryComponent, {}) }) }) }));
}
export default {
    title: "components/AppSettingsDialog",
    component: AppSettingsDialog,
    parameters: { colorScheme: "light" },
    decorators: [Wrapper],
};
export const Default = {
    render: () => {
        return _jsx(AppSettingsDialog, { open: true });
    },
};
export const DefaultChinese = {
    ...Default,
    parameters: { forceLanguage: "zh" },
};
export const DefaultJapanese = {
    ...Default,
    parameters: { forceLanguage: "ja" },
};
export const ChangingLanguage = {
    render: function Story() {
        return _jsx(AppSettingsDialog, { open: true });
    },
    play: async () => {
        const { click, keyboard } = userEvent.setup();
        const input = await screen.findByText("English", { exact: false });
        await click(input);
        await keyboard("中文");
        const item = await screen.findByText("中文", { exact: false });
        await click(item);
    },
};
export const General = {
    render: () => {
        return _jsx(AppSettingsDialog, { open: true, activeTab: "general" });
    },
};
export const GeneralChinese = {
    ...General,
    parameters: { forceLanguage: "zh" },
};
export const GeneralJapanese = {
    ...General,
    parameters: { forceLanguage: "ja" },
};
export const Privacy = {
    render: () => {
        return _jsx(AppSettingsDialog, { open: true, activeTab: "privacy" });
    },
};
export const PrivacyChinese = {
    ...Privacy,
    parameters: { forceLanguage: "zh" },
};
export const PrivacyJapanese = {
    ...Privacy,
    parameters: { forceLanguage: "ja" },
};
export const Extensions = {
    render: () => {
        return _jsx(AppSettingsDialog, { open: true, activeTab: "extensions" });
    },
};
export const ExtensionsChinese = {
    ...Extensions,
    parameters: { forceLanguage: "zh" },
};
export const ExtensionsJapanese = {
    ...Extensions,
    parameters: { forceLanguage: "ja" },
};
export const Experimental = {
    render: () => {
        return _jsx(AppSettingsDialog, { open: true, activeTab: "experimental-features" });
    },
};
export const ExperimentalChinese = {
    ...Experimental,
    parameters: { forceLanguage: "zh" },
};
export const ExperimentalJapanese = {
    ...Experimental,
    parameters: { forceLanguage: "ja" },
};
export const About = {
    render: () => {
        return _jsx(AppSettingsDialog, { open: true, activeTab: "about" });
    },
};
export const AboutChinese = {
    ...About,
    parameters: { forceLanguage: "zh" },
};
export const AboutJapanese = {
    ...About,
    parameters: { forceLanguage: "ja" },
};
