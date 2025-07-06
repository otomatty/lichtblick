/// <reference types="react" />
/**
 * ExtensionMarketplaceProvider
 *
 * 拡張機能マーケットプレイスの管理を行うProviderコンポーネントです。
 * 利用可能な拡張機能の情報取得とマークダウンコンテンツの取得機能を提供します。
 *
 * ## 主な機能
 * - マーケットプレイスからの拡張機能一覧取得
 * - 拡張機能の詳細情報（README等）の取得
 * - 外部APIとの通信管理
 * - キャッシュ機能による効率的なデータ取得
 *
 * ## 使用場面
 * - 拡張機能ストアの表示
 * - 拡張機能の詳細情報表示
 * - 新しい拡張機能の発見
 * - 拡張機能のメタデータ管理
 *
 * ## データソース
 * - GitHub上の公式マーケットプレイスリポジトリ
 * - 各拡張機能のREADMEファイル
 * - 拡張機能のメタデータ（バージョン、説明等）
 *
 * ## エラーハンドリング
 * - ネットワークエラーの処理
 * - 不正なJSONレスポンスの処理
 * - マークダウンファイルの取得エラー処理
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子コンポーネント
 * @returns React.JSX.Element
 *
 * @example
 * ```typescript
 * // アプリケーションでの使用
 * <ExtensionMarketplaceProvider>
 *   <ExtensionStore />
 *   <ExtensionDetails />
 * </ExtensionMarketplaceProvider>
 *
 * // 子コンポーネントでの使用
 * const marketplace = useContext(ExtensionMarketplaceContext);
 *
 * // 拡張機能一覧を取得
 * const extensions = await marketplace.getAvailableExtensions();
 *
 * // READMEを取得
 * const readme = await marketplace.getMarkdown(
 *   'https://raw.githubusercontent.com/example/extension/README.md'
 * );
 * ```
 */
export default function ExtensionMarketplaceProvider({ children, }: React.PropsWithChildren): React.JSX.Element;
