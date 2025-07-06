/// <reference types="react" />
/**
 * レイアウトバージョン互換性エラー警告ダイアログのプロパティ型定義
 */
type Props = {
    /** デスクトップアプリかどうかの判定（省略時は自動判定） */
    isDesktop?: boolean;
    /** ダイアログを閉じる際のコールバック関数 */
    onClose: () => void;
};
/**
 * レイアウトバージョン互換性エラー警告ダイアログコンポーネント
 *
 * サポート対象外のバージョンのレイアウトファイルが読み込まれた際に
 * 表示される警告ダイアログコンポーネントです。ユーザーに状況を説明し、
 * 適切な対処方法を案内します。
 *
 * ## 表示条件
 * レイアウトデータの`version`プロパティが`MAX_SUPPORTED_LAYOUT_VERSION`を
 * 超える値の場合に表示されます。
 *
 * ## 警告内容
 * - **タイトル**: レイアウトが開けない旨を通知
 * - **説明**: より新しいバージョンで作成されたレイアウトである旨を説明
 * - **対処法**: アプリケーションの更新を推奨
 *
 * ## プラットフォーム別対応
 * - **デスクトップ版**: ダウンロードページへのリンクを表示
 * - **Web版**: 一般的な更新案内メッセージを表示
 *
 * ## 多言語対応
 * `react-i18next`の`incompatibleLayoutVersion`名前空間を使用して、
 * ユーザーの言語設定に応じた適切な言語でメッセージを表示します。
 *
 * ## UI/UX設計
 * - **モーダルダイアログ**: 重要な警告として画面中央に表示
 * - **明確なアクション**: OKボタンでダイアログを閉じる
 * - **外部リンク**: 新しいタブでダウンロードページを開く
 *
 * ## 使用場面
 * - 新しいバージョンで作成されたレイアウトの読み込み時
 * - レイアウトファイルの互換性チェック失敗時
 * - バージョンアップグレード案内時
 *
 * ## 技術的背景
 * Lichtblick Suiteでは、レイアウトデータの構造変更に伴う
 * 後方互換性の問題を防ぐため、バージョン管理システムを採用しています。
 * 新機能の追加や仕様変更により、古いバージョンでは
 * 正常に処理できないレイアウトが作成される可能性があります。
 *
 * @param props - コンポーネントのプロパティ
 * @param props.isDesktop - デスクトップアプリかどうかの判定
 * @param props.onClose - ダイアログを閉じる際のコールバック関数
 * @returns React.JSX.Element - 警告ダイアログコンポーネント
 *
 * @example
 * ```typescript
 * // CurrentLayoutProvider内での条件付き表示
 * {incompatibleLayoutVersionError && (
 *   <IncompatibleLayoutVersionAlert
 *     onClose={() => setIncompatibleLayoutVersionError(false)}
 *   />
 * )}
 * ```
 *
 * @see MAX_SUPPORTED_LAYOUT_VERSION - サポート対象の最大バージョン
 * @see CurrentLayoutProvider - バージョンチェック実装箇所
 * @see isDesktopApp - デスクトップアプリ判定ユーティリティ
 */
export declare function IncompatibleLayoutVersionAlert(props: Props): React.JSX.Element;
export {};
