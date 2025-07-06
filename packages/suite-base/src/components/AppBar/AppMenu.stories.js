import { jsx as _jsx } from "react/jsx-runtime";
import { userEvent, within } from "@storybook/testing-library";
import * as _ from "lodash-es";
import PlayerSelectionContext from "@lichtblick/suite-base/context/PlayerSelectionContext";
import MockCurrentLayoutProvider from "@lichtblick/suite-base/providers/CurrentLayoutProvider/MockCurrentLayoutProvider";
import WorkspaceContextProvider from "@lichtblick/suite-base/providers/WorkspaceContextProvider";
import { AppMenu } from "./AppMenu";
/**
 * Meta Configuration - Storybookメタ設定
 *
 * AppMenuストーリーの基本設定と共通デコレーターを定義。
 * 全ストーリーで共有される設定とMockプロバイダーを提供します。
 */
export default {
    title: "components/AppBar/AppMenu",
    component: AppMenu,
    args: {
        open: true,
        anchorPosition: { top: 0, left: 0 },
        anchorReference: "anchorPosition",
        disablePortal: true,
        handleClose: _.noop,
    },
    decorators: [
        /**
         * Story Decorator - ストーリーデコレーター
         *
         * 各ストーリーに必要なMockプロバイダーを提供：
         * - MockCurrentLayoutProvider: レイアウト状態の模擬
         * - WorkspaceContextProvider: ワークスペース状態の模擬
         * - PlayerSelectionContext: プレイヤー選択状態の模擬
         *
         * @param Story - ラップするストーリーコンポーネント
         * @param args - ストーリー引数（testIdを除外）
         * @returns 装飾されたストーリー
         */
        (Story, { args: { testId: _testId, ...args } }) => (_jsx(MockCurrentLayoutProvider, { children: _jsx(WorkspaceContextProvider, { children: _jsx(PlayerSelectionContext.Provider, { value: playerSelection, children: _jsx(Story, { ...args }) }) }) })),
    ],
    /**
     * Play Function - 自動インタラクション実行
     *
     * testIdが指定された場合、自動的にホバーインタラクションを実行。
     * サブメニューの展開状態をテストするために使用されます。
     *
     * @param canvasElement - Storybookキャンバス要素
     * @param args - ストーリー引数
     */
    play: async ({ canvasElement, args }) => {
        if (!args.testId) {
            return;
        }
        const canvas = within(canvasElement);
        await userEvent.hover(await canvas.findByTestId(args.testId));
    },
};
/**
 * Mock Player Selection - プレイヤー選択状態の模擬データ
 *
 * AppMenuのFile > Recent Files機能をテストするための模擬データ。
 * 様々なデータソースタイプと長いファイル名のテストケースを含みます。
 */
const playerSelection = {
    selectSource: () => { },
    selectRecent: () => { },
    recentSources: [
        // 長いファイル名のテスト（テキスト省略機能の確認）
        {
            id: "1111",
            title: "NuScenes-v1.0-mini-scene-0655-reallllllllly-long-name-8829908290831091.bag",
        },
        // ROS 1接続のテスト
        { id: "2222", title: "http://localhost:11311", label: "ROS 1" },
        // Rosbridge WebSocket接続のテスト
        { id: "3333", title: "ws://localhost:9090/", label: "Rosbridge (ROS 1 & 2)" },
        // Foxglove WebSocket接続のテスト
        { id: "4444", title: "ws://localhost:8765", label: "Foxglove WebSocket" },
        // Velodyne Lidarデバイス接続のテスト
        { id: "5555", title: "2369", label: "Velodyne Lidar" },
        // Storybook非表示項目（表示制限のテスト）
        { id: "6666", title: "THIS ITEM SHOULD BE HIDDEN IN STORYBOOKS", label: "!!!!!!!!!!!!" },
    ],
    availableSources: [],
};
/**
 * Default Story - デフォルト表示ストーリー
 *
 * AppMenuの基本的な表示状態を確認するストーリー。
 * メニューが開いた状態で表示され、全体的なレイアウトを確認できます。
 */
export const Default = {};
// ========================================
// File Menu Stories - Fileメニューストーリー群
// ========================================
/**
 * File Menu Dark Theme - Fileメニュー（ダークテーマ）
 *
 * Fileメニューの展開状態をダークテーマで表示。
 * Recent Files一覧とメニュー項目の確認が可能です。
 */
export const FileMenuDark = {
    args: { testId: "app-menu-file" },
    parameters: { colorScheme: "dark" },
};
/**
 * File Menu Dark Chinese - Fileメニュー（ダークテーマ・中国語）
 *
 * 中国語ローカライゼーションでのFileメニュー表示テスト。
 * 多言語対応とテキスト長の調整を確認できます。
 */
export const FileMenuDarkChinese = {
    args: { testId: "app-menu-file" },
    parameters: { colorScheme: "dark", forceLanguage: "zh" },
};
/**
 * File Menu Dark Japanese - Fileメニュー（ダークテーマ・日本語）
 *
 * 日本語ローカライゼーションでのFileメニュー表示テスト。
 * 日本語文字の表示とレイアウト調整を確認できます。
 */
export const FileMenuDarkJapanese = {
    args: { testId: "app-menu-file" },
    parameters: { colorScheme: "dark", forceLanguage: "ja" },
};
/**
 * File Menu Light Theme - Fileメニュー（ライトテーマ）
 *
 * Fileメニューの展開状態をライトテーマで表示。
 * ダークテーマとの視覚的差異を確認できます。
 */
export const FileMenuLight = {
    args: { testId: "app-menu-file" },
    parameters: { colorScheme: "light" },
};
/**
 * File Menu Light Chinese - Fileメニュー（ライトテーマ・中国語）
 */
export const FileMenuLightChinese = {
    args: { testId: "app-menu-file" },
    parameters: { colorScheme: "light", forceLanguage: "zh" },
};
/**
 * File Menu Light Japanese - Fileメニュー（ライトテーマ・日本語）
 */
export const FileMenuLightJapanese = {
    args: { testId: "app-menu-file" },
    parameters: { colorScheme: "light", forceLanguage: "ja" },
};
// ========================================
// View Menu Stories - Viewメニューストーリー群
// ========================================
/**
 * View Menu Dark Theme - Viewメニュー（ダークテーマ）
 *
 * Viewメニューの展開状態をダークテーマで表示。
 * サイドバー制御とレイアウト管理機能を確認できます。
 */
export const ViewMenuDark = {
    args: { testId: "app-menu-view" },
    parameters: { colorScheme: "dark" },
};
/**
 * View Menu Dark Chinese - Viewメニュー（ダークテーマ・中国語）
 */
export const ViewMenuDarkChinese = {
    args: { testId: "app-menu-view" },
    parameters: { colorScheme: "dark", forceLanguage: "zh" },
};
/**
 * View Menu Dark Japanese - Viewメニュー（ダークテーマ・日本語）
 */
export const ViewMenuDarkJapanese = {
    args: { testId: "app-menu-view" },
    parameters: { colorScheme: "dark", forceLanguage: "ja" },
};
/**
 * View Menu Light Theme - Viewメニュー（ライトテーマ）
 */
export const ViewMenuLight = {
    args: { testId: "app-menu-view" },
    parameters: { colorScheme: "light" },
};
/**
 * View Menu Light Chinese - Viewメニュー（ライトテーマ・中国語）
 */
export const ViewMenuLightChinese = {
    args: { testId: "app-menu-view" },
    parameters: { colorScheme: "light", forceLanguage: "zh" },
};
/**
 * View Menu Light Japanese - Viewメニュー（ライトテーマ・日本語）
 */
export const ViewMenuLightJapanese = {
    ...ViewMenuLight,
    parameters: { colorScheme: "light", forceLanguage: "ja" },
};
// ========================================
// Help Menu Stories - Helpメニューストーリー群
// ========================================
/**
 * Help Menu Dark Theme - Helpメニュー（ダークテーマ）
 *
 * Helpメニューの展開状態をダークテーマで表示。
 * ドキュメントリンクとサポート情報を確認できます。
 */
export const HelpMenuDark = {
    args: { testId: "app-menu-help" },
    parameters: { colorScheme: "dark" },
};
/**
 * Help Menu Dark Chinese - Helpメニュー（ダークテーマ・中国語）
 */
export const HelpMenuDarkChinese = {
    args: { testId: "app-menu-help" },
    parameters: { colorScheme: "dark", forceLanguage: "zh" },
};
/**
 * Help Menu Dark Japanese - Helpメニュー（ダークテーマ・日本語）
 */
export const HelpMenuDarkJapanese = {
    args: { testId: "app-menu-help" },
    parameters: { colorScheme: "dark", forceLanguage: "ja" },
};
/**
 * Help Menu Light Theme - Helpメニュー（ライトテーマ）
 */
export const HelpMenuLight = {
    args: { testId: "app-menu-help" },
    parameters: { colorScheme: "light" },
};
/**
 * Help Menu Light Chinese - Helpメニュー（ライトテーマ・中国語）
 */
export const HelpMenuLightChinese = {
    args: { testId: "app-menu-help" },
    parameters: { colorScheme: "light", forceLanguage: "zh" },
};
/**
 * Help Menu Light Japanese - Helpメニュー（ライトテーマ・日本語）
 */
export const HelpMenuLightJapanese = {
    args: { testId: "app-menu-help" },
    parameters: { colorScheme: "light", forceLanguage: "ja" },
};
