import { PropsWithChildren } from "react";
/**
 * PanelCatalogProvider
 *
 * パネルカタログの管理を行うProviderコンポーネントです。
 * ビルトインパネルと拡張機能パネルを統合し、アプリケーション全体で
 * 利用可能なパネルの一覧と取得機能を提供します。
 *
 * ## 主な機能
 * - ビルトインパネルの管理
 * - 拡張機能パネルの動的ロード
 * - パネルの多言語対応
 * - パネルタイプによる検索機能
 * - パネルの統合カタログ提供
 *
 * ## パネルの種類
 * - **ビルトインパネル**: アプリケーションに組み込まれたパネル
 * - **拡張機能パネル**: 動的にロードされるカスタムパネル
 *
 * ## 使用場面
 * - パネル選択UI（パネルピッカー）
 * - レイアウトエディターでのパネル一覧表示
 * - 動的パネル生成
 * - パネルの検索・フィルタリング
 *
 * ## 多言語対応
 * - 言語変更時に自動的にパネル情報を再翻訳
 * - パネル名、説明、カテゴリの国際化対応
 *
 * ## 拡張機能パネルの処理
 * - PanelExtensionAdapterによるラッピング
 * - 拡張機能名前空間の管理
 * - 動的な型定義生成
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子コンポーネント
 * @returns React.ReactElement
 *
 * @example
 * ```typescript
 * // アプリケーションでの使用
 * <PanelCatalogProvider>
 *   <PanelPicker />
 *   <LayoutEditor />
 * </PanelCatalogProvider>
 *
 * // 子コンポーネントでの使用
 * const panelCatalog = useContext(PanelCatalogContext);
 *
 * // 全パネルを取得
 * const allPanels = panelCatalog.getPanels();
 *
 * // 特定のパネルを取得
 * const panel = panelCatalog.getPanelByType('3d');
 *
 * // パネルを動的に生成
 * const PanelComponent = await panel.module();
 * ```
 */
export default function PanelCatalogProvider(props: PropsWithChildren): React.ReactElement;
