/**
 * @fileoverview 拡張機能システムの型定義
 *
 * このファイルは、Lichtblickの拡張機能システムで使用される
 * 型定義を提供します。拡張機能の管理、インストール、
 * 実行に関する情報を定義します。
 */
/**
 * 拡張機能の名前空間
 *
 * @description 拡張機能の管理方法と配布元を区別するための名前空間です。
 *
 * - local: ユーザーが手動でインストールしたローカル拡張機能
 * - org: 組織によってリモート管理され、プロビジョニングされる拡張機能
 *
 * @example
 * ```typescript
 * // ローカル拡張機能
 * const localExtension = {
 *   namespace: "local" as ExtensionNamespace,
 *   name: "my-custom-panel"
 * };
 *
 * // 組織管理の拡張機能
 * const orgExtension = {
 *   namespace: "org" as ExtensionNamespace,
 *   name: "company-dashboard"
 * };
 * ```
 */
export type ExtensionNamespace = "local" | "org";
/**
 * 拡張機能のメタデータ
 *
 * @description 拡張機能の詳細情報を含むメタデータです。
 * 拡張機能の識別、説明、バージョン管理、ライセンス情報などを含みます。
 *
 * @example
 * ```typescript
 * const extensionInfo: ExtensionInfo = {
 *   id: "my-extension-123",
 *   description: "カスタムデータ可視化パネル",
 *   displayName: "データビジュアライザー",
 *   homepage: "https://github.com/user/my-extension",
 *   keywords: ["visualization", "data", "panel"],
 *   license: "MIT",
 *   name: "data-visualizer",
 *   namespace: "local",
 *   publisher: "MyCompany",
 *   qualifiedName: "MyCompany.data-visualizer",
 *   version: "1.2.0",
 *   readme: "# データビジュアライザー\n\n高度なデータ可視化機能を提供します。",
 *   changelog: "## v1.2.0\n- 新しいチャート形式を追加\n- パフォーマンス改善"
 * };
 * ```
 */
export type ExtensionInfo = {
    /** 拡張機能の一意識別子 */
    id: string;
    /** 拡張機能の説明 */
    description: string;
    /** 拡張機能の表示名 */
    displayName: string;
    /** 拡張機能のホームページURL */
    homepage: string;
    /** 検索用のキーワード配列 */
    keywords: string[];
    /** ライセンス情報 */
    license: string;
    /** 拡張機能の名前 */
    name: string;
    /** 拡張機能の名前空間 (省略時は"local") */
    namespace?: ExtensionNamespace;
    /** 発行者/開発者名 */
    publisher: string;
    /** 完全修飾名 (通常は "publisher.name" の形式) */
    qualifiedName: string;
    /** バージョン文字列 (セマンティックバージョニング推奨) */
    version: string;
    /** README文書 (Markdown形式) */
    readme?: string;
    /** 変更履歴 (Markdown形式) */
    changelog?: string;
};
