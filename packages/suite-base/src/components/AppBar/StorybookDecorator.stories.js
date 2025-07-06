import { jsx as _jsx } from "react/jsx-runtime";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MockMessagePipelineProvider from "@lichtblick/suite-base/components/MessagePipeline/MockMessagePipelineProvider";
import Panel from "@lichtblick/suite-base/components/Panel";
import PanelCatalogContext from "@lichtblick/suite-base/context/PanelCatalogContext";
import MockCurrentLayoutProvider from "@lichtblick/suite-base/providers/CurrentLayoutProvider/MockCurrentLayoutProvider";
import WorkspaceContextProvider from "@lichtblick/suite-base/providers/WorkspaceContextProvider";
/**
 * Sample Panel 1 - サンプルパネル1
 *
 * パネルカタログテスト用のサンプルパネルコンポーネント。
 * 最小限の実装でパネルの基本構造を提供します。
 */
const SamplePanel1 = function () {
    return _jsx("div", {});
};
SamplePanel1.panelType = "sample";
SamplePanel1.defaultConfig = {};
/**
 * Sample Panel 2 - サンプルパネル2
 *
 * パネルカタログテスト用の2番目のサンプルパネルコンポーネント。
 * 複数パネルタイプの存在をテストするために使用されます。
 */
const SamplePanel2 = function () {
    return _jsx("div", {});
};
SamplePanel2.panelType = "sample2";
SamplePanel2.defaultConfig = {};
/**
 * Mock Panel Components - Mockパネルコンポーネント
 *
 * PanelHOCでラップされたサンプルパネル。
 * パネルシステムの動作テストに使用されます。
 */
const MockPanel1 = Panel(SamplePanel1);
const MockPanel2 = Panel(SamplePanel2);
/**
 * All Panels Data - 全パネル情報
 *
 * パネルカタログに表示される全パネルの情報を定義。
 * 通常パネルと事前設定パネルの両方を含みます。
 *
 * パネルタイプ：
 * - Regular Panel: 標準パネル（デフォルト設定）
 * - Preconfigured Panel: 事前設定パネル（カスタム設定付き）
 */
const allPanels = [
    // 通常パネル（アルファベット順でソート確認）
    { title: "Regular Panel BBB", type: "Sample1", module: async () => ({ default: MockPanel1 }) },
    { title: "Regular Panel AAA", type: "Sample2", module: async () => ({ default: MockPanel2 }) },
    // 事前設定パネル（設定値付き）
    {
        title: "Preconfigured Panel AAA",
        type: "Sample1",
        description: "Panel description",
        module: async () => ({ default: MockPanel1 }),
        config: { text: "def" },
    },
    {
        title: "Preconfigured Panel BBB",
        type: "Sample2",
        module: async () => ({ default: MockPanel1 }),
        config: { num: 456 },
    },
];
/**
 * Mock Panel Catalog - Mockパネルカタログ
 *
 * PanelCatalogインターフェースの模擬実装。
 * パネル一覧の取得とタイプ別パネル検索機能を提供します。
 *
 * 主な機能：
 * - panels: パネル情報の配列プロパティ
 * - getPanels(): 全パネル情報の取得
 * - getPanelByType(): タイプ別パネル検索
 * - 事前設定パネルの除外処理
 */
class MockPanelCatalog {
    /** パネル情報の配列（インターフェース要求プロパティ） */
    panels = allPanels;
    /**
     * Get All Panels - 全パネル取得
     *
     * 登録されている全パネルの情報を返します。
     *
     * @returns 全パネル情報の配列
     */
    getPanels() {
        return allPanels;
    }
    /**
     * Get Panel By Type - タイプ別パネル取得
     *
     * 指定されたタイプのパネルを検索して返します。
     * 事前設定パネル（configが設定されているパネル）は除外されます。
     *
     * @param type - 検索するパネルタイプ
     * @returns マッチするパネル情報（見つからない場合はundefined）
     */
    getPanelByType(type) {
        return allPanels.find((panel) => !panel.config && panel.type === type);
    }
}
/**
 * Default Export - デフォルトエクスポート
 *
 * Storybookのメタデータ定義。
 * StorybookDecoratorを他のストーリーから除外するための設定を含みます。
 */
export default {
    title: "components/AppBar",
    excludeStories: ["StorybookDecorator"],
};
/**
 * Storybook Decorator - Storybookデコレーター
 *
 * AppBarコンポーネントのストーリーで使用する共通デコレーター関数。
 * 必要な全てのプロバイダーとMock環境を階層的に提供します。
 *
 * プロバイダー階層：
 * 1. DndProvider - ドラッグ&ドロップ機能
 * 2. WorkspaceContextProvider - ワークスペース状態
 * 3. PanelCatalogContext - パネルカタログ
 * 4. MockCurrentLayoutProvider - レイアウト管理
 * 5. MockMessagePipelineProvider - メッセージパイプライン
 *
 * @param Wrapped - ラップするストーリーコンポーネント
 * @returns 全プロバイダーでラップされたコンポーネント
 */
export function StorybookDecorator(Wrapped) {
    return (_jsx(DndProvider, { backend: HTML5Backend, children: _jsx(WorkspaceContextProvider, { children: _jsx(PanelCatalogContext.Provider, { value: new MockPanelCatalog(), children: _jsx(MockCurrentLayoutProvider, { children: _jsx(MockMessagePipelineProvider, { children: _jsx(Wrapped, {}) }) }) }) }) }));
}
