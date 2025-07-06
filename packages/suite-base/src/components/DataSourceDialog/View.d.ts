import { PropsWithChildren } from "react";
/**
 * Viewコンポーネントのプロパティ型
 */
type ViewProps = {
    /**
     * 開くボタンのクリックハンドラー
     *
     * 定義されている場合、開くボタンが有効になります。
     * 未定義の場合、開くボタンは無効化されます。
     *
     * @example
     * ```tsx
     * const handleOpen = () => {
     *   // データソース接続処理
     *   connectToDataSource(selectedSource);
     * };
     *
     * <View onOpen={handleOpen}>
     *   <SourceSelector />
     * </View>
     * ```
     */
    onOpen?: () => void;
};
/**
 * View コンポーネント
 *
 * DataSourceDialogの各ビューで共通して使用されるレイアウトと
 * ナビゲーション機能を提供します。子コンポーネントをメイン
 * コンテンツ領域に表示し、下部にナビゲーションボタンを配置します。
 *
 * ## レイアウト構造
 *
 * ```
 * ┌─────────────────────────────────┐
 * │ コンテンツ領域                    │
 * │ (子コンポーネント)                │
 * │                               │
 * │                               │
 * ├─────────────────────────────────┤
 * │ [戻る]              [キャンセル] [開く] │
 * └─────────────────────────────────┘
 * ```
 *
 * ## ボタンの動作
 *
 * - **戻るボタン**: 常に表示され、スタート画面に遷移
 * - **キャンセルボタン**: 常に表示され、ダイアログを閉じる
 * - **開くボタン**: onOpenが定義されている場合のみ有効
 *
 * @param props - コンポーネントプロパティ（children含む）
 * @returns レンダリングされたビューコンポーネント
 */
export default function View(props: PropsWithChildren<ViewProps>): React.JSX.Element;
export {};
