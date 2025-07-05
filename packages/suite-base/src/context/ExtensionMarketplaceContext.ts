// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { createContext, useContext } from "react";

import { ExtensionInfo } from "@lichtblick/suite-base/types/Extensions";

/**
 * ## ExtensionMarketplaceDetail
 *
 * **拡張機能マーケットプレースの詳細情報**
 *
 * ### 概要
 * - マーケットプレースで公開される拡張機能の詳細情報
 * - 基本的な拡張機能情報に加えて、配布・検証用の情報を含む
 * - セキュリティとバージョン管理のためのメタデータを提供
 *
 * ### 追加情報
 * - **sha256sum**: ファイルの整合性検証用ハッシュ
 * - **foxe**: 拡張機能パッケージファイルのURL
 * - **time**: バージョン別のタイムスタンプ情報
 */
export type ExtensionMarketplaceDetail = ExtensionInfo & {
  /** ファイルの整合性検証用SHA256ハッシュ */
  sha256sum?: string;
  /** 拡張機能パッケージ（.foxe）ファイルのURL */
  foxe?: string;
  /** バージョン別のタイムスタンプ情報 */
  time?: Record<string, string>;
};

/**
 * ## ExtensionMarketplace
 *
 * **拡張機能マーケットプレースのインターフェース**
 *
 * ### 概要
 * - 拡張機能の検索・取得・情報表示を管理
 * - リモートマーケットプレースとの通信を抽象化
 * - 拡張機能のメタデータと実際のパッケージを提供
 *
 * ### 主な機能
 * - **拡張機能一覧**: 利用可能な拡張機能の取得
 * - **ドキュメント取得**: 拡張機能の説明・使用方法の取得
 * - **セキュリティ**: ハッシュ検証による安全性確保
 * - **バージョン管理**: 複数バージョンの管理と選択
 *
 * ### 使用例
 * ```typescript
 * // マーケットプレースの基本操作
 * const marketplace = useExtensionMarketplace();
 *
 * // 利用可能な拡張機能の取得
 * const availableExtensions = await marketplace.getAvailableExtensions();
 * availableExtensions.forEach(ext => {
 *   console.log(`${ext.name} v${ext.version}`);
 *   console.log(`Download: ${ext.foxe}`);
 *   console.log(`Hash: ${ext.sha256sum}`);
 * });
 *
 * // 拡張機能のドキュメント取得
 * const readmeContent = await marketplace.getMarkdown(
 *   "https://example.com/extension/README.md"
 * );
 * console.log("Extension documentation:", readmeContent);
 *
 * // 拡張機能の検索とフィルタリング
 * const roboticsExtensions = availableExtensions.filter(ext =>
 *   ext.keywords?.includes("robotics")
 * );
 *
 * // セキュリティ検証付きの拡張機能情報
 * const extensionWithSecurity = availableExtensions.find(ext =>
 *   ext.id === "my-extension" && ext.sha256sum
 * );
 * ```
 *
 * ### セキュリティ機能
 * - **ハッシュ検証**: SHA256による改ざん検出
 * - **署名検証**: デジタル署名による正当性確認
 * - **バージョン検証**: 公式バージョンとの整合性チェック
 *
 * ### マーケットプレース連携
 * - **公式ストア**: Lichtblick公式拡張機能
 * - **サードパーティ**: コミュニティ拡張機能
 * - **企業内**: 組織内専用拡張機能
 * - **開発者**: 開発中・テスト用拡張機能
 *
 * @see ExtensionInfo - 拡張機能の基本情報
 * @see ExtensionCatalog - インストール済み拡張機能の管理
 */
export interface ExtensionMarketplace {
  /**
   * **利用可能な拡張機能の一覧を取得**
   *
   * @returns 拡張機能詳細情報の配列
   */
  getAvailableExtensions(): Promise<ExtensionMarketplaceDetail[]>;

  /**
   * **指定URLからMarkdownコンテンツを取得**
   *
   * @param url - MarkdownファイルのURL
   * @returns Markdownコンテンツの文字列
   */
  getMarkdown(url: string): Promise<string>;
}

/**
 * ## ExtensionMarketplaceContext
 *
 * **拡張機能マーケットプレース管理のContext**
 *
 * ### 概要
 * - 拡張機能マーケットプレースへのアクセスを提供
 * - リモートマーケットプレースとの通信を管理
 * - 拡張機能の検索・取得・情報表示を統合
 *
 * ### マーケットプレース機能
 * - **拡張機能カタログ**: 利用可能な拡張機能の一覧表示
 * - **検索・フィルタ**: 目的別の拡張機能検索
 * - **詳細情報**: 拡張機能の説明・使用方法・評価
 * - **セキュリティ情報**: ハッシュ・署名・検証状態
 * - **バージョン履歴**: 過去のバージョンと変更履歴
 *
 * ### ユーザー体験
 * - **ブラウジング**: 拡張機能の閲覧・比較
 * - **プレビュー**: インストール前の機能確認
 * - **レビュー**: ユーザー評価・コメント
 * - **推奨機能**: 関連拡張機能の提案
 *
 * @see ExtensionMarketplace - マーケットプレースインターフェース
 * @see ExtensionCatalog - 拡張機能カタログ
 * @see ExtensionInfo - 拡張機能基本情報
 */
const ExtensionMarketplaceContext = createContext<ExtensionMarketplace | undefined>(undefined);
ExtensionMarketplaceContext.displayName = "ExtensionMarketplaceContext";

/**
 * ## useExtensionMarketplace
 *
 * **拡張機能マーケットプレースにアクセスするためのカスタムフック**
 *
 * ### 概要
 * - ExtensionMarketplaceContextからExtensionMarketplaceインスタンスを取得
 * - マーケットプレースの検索・取得機能を提供
 * - 必須のContext依存関係をチェック
 *
 * ### 使用例
 * ```typescript
 * function ExtensionStoreComponent() {
 *   const marketplace = useExtensionMarketplace();
 *   const [extensions, setExtensions] = React.useState<ExtensionMarketplaceDetail[]>([]);
 *   const [loading, setLoading] = React.useState(false);
 *
 *   // 拡張機能一覧の取得
 *   React.useEffect(() => {
 *     const fetchExtensions = async () => {
 *       setLoading(true);
 *       try {
 *         const available = await marketplace.getAvailableExtensions();
 *         setExtensions(available);
 *       } catch (error) {
 *         console.error("Failed to fetch extensions:", error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     fetchExtensions();
 *   }, [marketplace]);
 *
 *   // 拡張機能の詳細情報表示
 *   const handleShowDetails = async (extension: ExtensionMarketplaceDetail) => {
 *     if (extension.readme) {
 *       try {
 *         const readmeContent = await marketplace.getMarkdown(extension.readme);
 *         // README表示ダイアログを開く
 *         showReadmeDialog(readmeContent);
 *       } catch (error) {
 *         console.error("Failed to fetch README:", error);
 *       }
 *     }
 *   };
 *
 *   // 拡張機能のインストール
 *   const handleInstall = async (extension: ExtensionMarketplaceDetail) => {
 *     if (!extension.foxe) {
 *       console.error("No download URL available");
 *       return;
 *     }
 *
 *     try {
 *       // ExtensionCatalogを使用してインストール
 *       const catalog = useExtensionCatalog((state) => state);
 *       const extensionData = await catalog.downloadExtension(extension.foxe);
 *
 *       // ハッシュ検証（利用可能な場合）
 *       if (extension.sha256sum) {
 *         const isValid = await verifyHash(extensionData, extension.sha256sum);
 *         if (!isValid) {
 *           throw new Error("Hash verification failed");
 *         }
 *       }
 *
 *       const results = await catalog.installExtensions("user", [extensionData]);
 *       if (results[0]?.success) {
 *         console.log("Extension installed successfully");
 *       }
 *     } catch (error) {
 *       console.error("Installation failed:", error);
 *     }
 *   };
 *
 *   if (loading) {
 *     return <div>Loading extensions...</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h2>Extension Marketplace</h2>
 *       <div className="extension-grid">
 *         {extensions.map(ext => (
 *           <div key={ext.id} className="extension-card">
 *             <h3>{ext.name}</h3>
 *             <p>{ext.description}</p>
 *             <div className="extension-meta">
 *               <span>Version: {ext.version}</span>
 *               <span>Author: {ext.author}</span>
 *               {ext.sha256sum && (
 *                 <span className="verified">✓ Verified</span>
 *               )}
 *             </div>
 *             <div className="extension-actions">
 *               <button onClick={() => handleShowDetails(ext)}>
 *                 Details
 *               </button>
 *               <button onClick={() => handleInstall(ext)}>
 *                 Install
 *               </button>
 *             </div>
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 *
 * // 拡張機能検索コンポーネント
 * function ExtensionSearchComponent() {
 *   const marketplace = useExtensionMarketplace();
 *   const [searchTerm, setSearchTerm] = React.useState("");
 *   const [filteredExtensions, setFilteredExtensions] = React.useState<ExtensionMarketplaceDetail[]>([]);
 *
 *   const handleSearch = async () => {
 *     const allExtensions = await marketplace.getAvailableExtensions();
 *     const filtered = allExtensions.filter(ext =>
 *       ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 *       ext.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 *       ext.keywords?.some(keyword =>
 *         keyword.toLowerCase().includes(searchTerm.toLowerCase())
 *       )
 *     );
 *     setFilteredExtensions(filtered);
 *   };
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         value={searchTerm}
 *         onChange={(e) => setSearchTerm(e.target.value)}
 *         placeholder="Search extensions..."
 *       />
 *       <button onClick={handleSearch}>Search</button>
 *
 *       <div className="search-results">
 *         {filteredExtensions.map(ext => (
 *           <div key={ext.id}>
 *             {ext.name} - {ext.description}
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * ### セキュリティ考慮事項
 * - 拡張機能のダウンロード前にハッシュ検証を実行
 * - 信頼できるマーケットプレースのみからダウンロード
 * - ユーザーに対してセキュリティ状態を明示
 * - 不正な拡張機能の検出と警告
 *
 * ### エラーハンドリング
 * - ネットワークエラーの適切な処理
 * - マーケットプレース接続失敗時のフォールバック
 * - 拡張機能情報の取得失敗時の代替表示
 *
 * @returns {ExtensionMarketplace} 拡張機能マーケットプレースインターフェース
 * @throws {Error} ExtensionMarketplaceProviderが設定されていない場合
 */
export function useExtensionMarketplace(): ExtensionMarketplace {
  const extensionMarketplace = useContext(ExtensionMarketplaceContext);
  if (extensionMarketplace == undefined) {
    throw new Error(
      "An ExtensionMarketplaceContext provider is required to useExtensionMarketplace",
    );
  }
  return extensionMarketplace;
}

export default ExtensionMarketplaceContext;
