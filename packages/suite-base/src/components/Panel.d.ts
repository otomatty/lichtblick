import { ComponentType } from "react";
import { PanelConfig, SaveConfig } from "@lichtblick/suite-base/types/panels";
/**
 * Panel HOCに渡されるプロパティの型定義
 *
 * @template Config - パネル固有の設定型
 */
type Props<Config> = {
    /** パネルの一意識別子（省略時はフォールバック値を使用） */
    childId?: string;
    /** 設定の上書き（テスト・Storybook用） */
    overrideConfig?: Config;
    /** 所属するタブのID（タブ内パネルの場合） */
    tabId?: string;
};
/**
 * パネルコンポーネントが実装すべき静的プロパティ
 *
 * Panel HOCでラップされる全てのコンポーネントは、この
 * インターフェースを実装する必要がある。
 *
 * @template Config - パネル固有の設定型
 */
export interface PanelStatics<Config> {
    /** パネルタイプの一意識別子 */
    panelType: string;
    /** パネルのデフォルト設定 */
    defaultConfig: Config;
}
/**
 * Panel HOC - 全パネルコンポーネントをラップする高階コンポーネント
 *
 * このHOCは、パネルコンポーネントに以下の機能を自動的に提供する：
 * - 設定管理（config/saveConfig）
 * - レイアウト統合（分割、移動、削除）
 * - エラーハンドリング
 * - ドラッグ&ドロップ
 * - キーボードショートカット
 * - フルスクリーン表示
 * - パフォーマンス監視
 *
 * ## 使用方法
 *
 * ```typescript
 * // パネルコンポーネントの定義
 * function MyPanel({ config, saveConfig }: PanelProps<MyPanelConfig>) {
 *   return <div>{config.title}</div>;
 * }
 *
 * // 必須の静的プロパティ
 * MyPanel.panelType = "MyPanel";
 * MyPanel.defaultConfig = { title: "Default" };
 *
 * // Panel HOCでラップ
 * export default Panel(MyPanel);
 * ```
 *
 * ## 型パラメータ
 *
 * @template Config - パネル固有の設定型（PanelConfigを継承）
 * @template PanelProps - パネルコンポーネントのProps型
 *
 * @param PanelComponent - ラップするパネルコンポーネント
 * @returns ラップされたパネルコンポーネント（静的プロパティ付き）
 *
 * ## 技術的詳細
 *
 * - **HOCパターン**: 横断的関心事の分離
 * - **型安全性**: TypeScriptの高度な型システム活用
 * - **パフォーマンス**: React.memoによる最適化
 * - **テスト可能性**: 依存性注入とモック対応
 *
 * @author Lichtblick Team
 * @since 2023
 */
export default function Panel<Config extends PanelConfig, PanelProps extends {
    config: Config;
    saveConfig: SaveConfig<Config>;
}>(PanelComponent: ComponentType<PanelProps> & PanelStatics<Config>): ComponentType<Props<Config> & Omit<PanelProps, "config" | "saveConfig">> & PanelStatics<Config>;
export {};
