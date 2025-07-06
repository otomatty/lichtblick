/// <reference types="react" />
import { SaveConfig } from "@lichtblick/suite-base/types/panels";
/**
 * UnknownPanelコンポーネントのプロパティ型定義
 *
 * 設定は保存されないため、overrideConfigとして使用される。
 * _type_設定オプションは、欠損パネルの元のタイプを示す。
 */
type Props = {
    /** パネル設定（元のパネルタイプとIDを含む） */
    config: {
        /** 欠損パネルの元のタイプ名 */
        type: string;
        /** パネルの一意識別子 */
        id: string;
    };
    /** 設定保存関数（UnknownPanelでは使用されない） */
    saveConfig: SaveConfig<unknown>;
};
/**
 * UnknownPanel - 欠損パネルのフォールバック表示コンポーネント
 *
 * レイアウトで参照されているが実際には利用できないパネルの
 * 代替表示を行うフォールバックコンポーネント。拡張機能の
 * アンインストールやパネルタイプの変更により発生する問題を
 * 優雅に処理し、アプリケーション全体の安定性を保つ。
 *
 * ## 自動使用のメカニズム
 *
 * UnknownPanelは通常、開発者が直接使用するものではなく、
 * パネルレジストリシステムによって自動的に選択される：
 *
 * ```typescript
 * // パネル解決プロセス（疑似コード）
 * function resolvePanel(panelType: string) {
 *   const PanelComponent = panelRegistry.get(panelType);
 *
 *   if (PanelComponent) {
 *     return PanelComponent;
 *   } else {
 *     // 欠損パネルの場合、UnknownPanelを返す
 *     return UnknownPanel;
 *   }
 * }
 * ```
 *
 * ## 拡張機能エコシステムとの統合
 *
 * Lichtblickの拡張機能システムでは、パネルタイプが動的に
 * 追加・削除される。UnknownPanelは、この動的な環境で
 * 発生する問題に対する堅牢な解決策を提供する：
 *
 * - **拡張機能のアンインストール**: 既存レイアウトの保護
 * - **バージョンアップ**: 互換性問題の緩和
 * - **開発環境**: プロトタイプパネルの安全な削除
 * - **設定移行**: 一時的な不整合状態の処理
 *
 * ## エラーハンドリング戦略
 *
 * UnknownPanelは、"fail-fast"ではなく"fail-safe"アプローチを
 * 採用している。これにより：
 *
 * - ユーザーは他のパネルを継続して使用可能
 * - レイアウト全体の構造が保持される
 * - 問題の特定と修正が容易になる
 * - システム全体の安定性が向上する
 *
 * @example
 * ```typescript
 * // 通常は自動的に使用されるが、手動での使用例
 * <UnknownPanel
 *   config={{ type: "missing-panel", id: "panel-123" }}
 *   saveConfig={() => {}}
 * />
 * ```
 *
 * @author Lichtblick Team
 * @since 2023
 */
export declare const UnknownPanel: import("react").ComponentType<{
    childId?: string | undefined;
    overrideConfig?: {} | undefined;
    tabId?: string | undefined;
} & Omit<Props, "config" | "saveConfig">> & import("@lichtblick/suite-base/components/Panel").PanelStatics<{}>;
export {};
