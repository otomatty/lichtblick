import { DataSourceDialogItem } from "@lichtblick/suite-base/components/DataSourceDialog/DataSourceDialog";
/**
 * DataSourceDialogのサイドバーアイテム表示コンポーネント
 *
 * このコンポーネントは、データソースダイアログの右側サイドバーに表示される
 * 各種アクションアイテム（チュートリアル、ヘルプ、コラボレーション機能など）を管理します。
 *
 * ## 主な機能
 * - **ユーザータイプ別表示制御**: 認証状態とプランに応じて異なるアイテムを表示
 * - **アナリティクス統合**: 各種ボタンクリックイベントの追跡
 * - **外部リンク管理**: ドキュメント、チュートリアル、コンソールへのリンク
 * - **国際化対応**: 多言語対応でのテキスト表示
 *
 * ## ユーザータイプ別表示内容
 *
 * ### 未認証ユーザー (unauthenticated)
 * - Lichtblickが初めての方向け案内
 * - サンプルデータ探索ボタン
 * - ドキュメント閲覧ボタン
 *
 * ### 認証済み無料ユーザー (authenticated-free)
 * - コラボレーション開始案内
 * - データプラットフォームアップロードボタン
 * - レイアウト共有ボタン
 * - 上記に加えて未認証ユーザー向けアイテム
 *
 * ### チーム/エンタープライズユーザー (authenticated-team/enterprise)
 * - Lichtblickが初めての方向け案内
 * - ヘルプとサポート案内
 * - チュートリアル閲覧ボタン
 *
 * ## レイアウト構造
 * ```
 * サイドバーアイテム
 * ├── メインコンテンツエリア
 * │   ├── アイテム1 (タイトル + 説明 + アクションボタン群)
 * │   ├── アイテム2 (タイトル + 説明 + アクションボタン群)
 * │   └── ...
 * └── 「今後表示しない」チェックボックス
 * ```
 *
 * ## アナリティクス追跡
 * - DIALOG_SELECT_VIEW: ビュー選択イベント
 * - DIALOG_CLICK_CTA: CTA（行動喚起）ボタンクリックイベント
 * - ユーザータイプとアクション種別を含む詳細な追跡情報
 *
 * ## 外部リンク
 * - Lichtblickドキュメント
 * - Foxgloveチュートリアル
 * - Foxgloveコンソール（データプラットフォーム）
 * - レイアウト共有ドキュメント
 *
 * @param props - コンポーネントプロパティ
 * @param props.onSelectView - ビュー選択時のコールバック関数
 * @returns サイドバーアイテムを表示するReactコンポーネント
 *
 * @example
 * ```tsx
 * <SidebarItems
 *   onSelectView={(view) => setCurrentView(view)}
 * />
 * ```
 */
declare const SidebarItems: (props: {
    onSelectView: (newValue: DataSourceDialogItem) => void;
}) => React.JSX.Element;
export default SidebarItems;
