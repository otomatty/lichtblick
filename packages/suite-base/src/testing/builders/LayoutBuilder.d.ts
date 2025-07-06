import { LayoutData } from "@lichtblick/suite-base/context/CurrentLayoutContext";
import { Layout, LayoutBaseline, LayoutSyncInfo } from "@lichtblick/suite-base/services/ILayoutStorage";
import { PlaybackConfig, UserScript, UserScripts } from "@lichtblick/suite-base/types/panels";
export default class LayoutBuilder {
    static playbackConfig(props?: Partial<PlaybackConfig>): PlaybackConfig;
    static userScript(props?: Partial<UserScript>): UserScript;
    static userScripts(count?: number): UserScripts;
    static data(props?: Partial<LayoutData>): LayoutData;
    static baseline(props?: Partial<LayoutBaseline>): LayoutBaseline;
    static syncInfo(props?: Partial<LayoutSyncInfo>): LayoutSyncInfo;
    static layout(props?: Partial<Layout>): Layout;
}
