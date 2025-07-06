import React, { PropsWithChildren } from "react";
import { RegisterMessageConverterArgs } from "@lichtblick/suite";
import { ExtensionLoader } from "@lichtblick/suite-base/services/ExtensionLoader";
/**
 * ExtensionCatalogProvider
 *
 * 拡張機能カタログの管理を行うProviderコンポーネントです。
 * 複数の拡張機能ローダーを統合し、拡張機能のインストール・アンインストール・
 * 更新を管理します。アプリケーション全体で拡張機能の状態を共有します。
 *
 * ## 主な機能
 * - 拡張機能のライフサイクル管理（インストール、アンインストール、更新）
 * - 複数の拡張機能ローダーの統合管理
 * - 拡張機能の貢献ポイント（パネル、メッセージコンバーター等）の管理
 * - バッチ処理による効率的な拡張機能操作
 * - エラーハンドリングとロギング
 *
 * ## 使用場面
 * - 拡張機能ストアの管理
 * - カスタムパネルの動的ロード
 * - メッセージコンバーターの管理
 * - カメラモデルの登録・管理
 * - 拡張機能の設定管理
 *
 * ## アーキテクチャ
 * - Zustandストアによる状態管理
 * - 複数ローダーによる柔軟な拡張機能ソース対応
 * - 貢献ポイントシステムによる機能拡張
 * - バッチ処理による性能最適化
 *
 * ## 拡張機能ローダー
 * - ローカルファイルシステム
 * - リモートURL
 * - 開発用モック
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子コンポーネント
 * @param props.loaders - 拡張機能ローダーの配列
 * @param props.mockMessageConverters - テスト用のモックメッセージコンバーター
 * @returns React.JSX.Element
 *
 * @example
 * ```typescript
 * const loaders = [
 *   new LocalExtensionLoader(),
 *   new RemoteExtensionLoader()
 * ];
 *
 * <ExtensionCatalogProvider loaders={loaders}>
 *   <ExtensionManager />
 *   <PanelCatalog />
 * </ExtensionCatalogProvider>
 *
 * // 子コンポーネントでの使用
 * const catalog = useContext(ExtensionCatalogContext);
 * const installedExtensions = catalog.getState().installedExtensions;
 *
 * // 拡張機能をインストール
 * await catalog.getState().installExtensions('local', [extensionData]);
 * ```
 */
export default function ExtensionCatalogProvider({ children, loaders, mockMessageConverters, }: PropsWithChildren<{
    loaders: readonly ExtensionLoader[];
    mockMessageConverters?: readonly RegisterMessageConverterArgs<unknown>[];
}>): React.JSX.Element;
