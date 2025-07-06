import { ContributionPoints } from "@lichtblick/suite-base/context/ExtensionCatalogContext";
import { ExtensionInfo } from "@lichtblick/suite-base/types/Extensions";
/**
 * 拡張機能のコントリビューションポイントを構築する関数
 *
 * この関数は拡張機能の動的実行とライフサイクル管理の中核を担います。
 * 拡張機能のソースコードを動的にロードし、安全なサンドボックス環境で実行して、
 * 拡張機能が提供する各種機能（パネル、メッセージコンバータ、カメラモデルなど）を
 * アプリケーションに統合します。
 *
 * ## 主な機能
 * - **動的コード実行**: 拡張機能のJavaScriptコードを安全に実行
 * - **コントリビューション収集**: 拡張機能が登録する各種機能の収集
 * - **名前空間管理**: 拡張機能間の名前衝突を防ぐ
 * - **エラーハンドリング**: 拡張機能実行時のエラーを適切に処理
 * - **ライフサイクル管理**: 拡張機能の初期化プロセスを管理
 *
 * ## セキュリティ考慮事項
 * - 制限されたrequire関数により、利用可能なモジュールを制限
 * - 拡張機能は独立したモジュールスコープで実行
 * - エラーは適切にキャッチされ、アプリケーション全体への影響を防止
 *
 * ## 拡張機能の実行フロー
 * 1. 拡張機能のソースコードを受け取る
 * 2. ExtensionContextを作成し、登録API群を提供
 * 3. 制限されたrequire関数とmodule.exportsを準備
 * 4. new Function()でコードを動的実行
 * 5. activate()メソッドを呼び出して拡張機能を初期化
 * 6. 登録された各種機能をContributionPointsとして返却
 *
 * ## 登録可能な機能
 * - **パネル**: カスタムUI要素
 * - **メッセージコンバータ**: データ変換ロジック
 * - **トピックエイリアス**: トピック名の別名定義
 * - **カメラモデル**: カメラキャリブレーション機能
 * - **パネル設定**: 各機能の設定項目
 *
 * @param extension - 拡張機能の基本情報（名前、ID、名前空間など）
 * @param unwrappedExtensionSource - 拡張機能のJavaScriptソースコード文字列
 * @returns 拡張機能が提供する全ての機能を含むContributionPoints
 *
 * @example
 * ```typescript
 * // 拡張機能の基本情報
 * const extensionInfo: ExtensionInfo = {
 *   id: "my-extension",
 *   qualifiedName: "com.example.my-extension",
 *   namespace: "myExtension",
 *   // ... その他の情報
 * };
 *
 * // 拡張機能のソースコード
 * const sourceCode = `
 *   module.exports = {
 *     activate: (context) => {
 *       context.registerPanel({
 *         name: "MyPanel",
 *         initPanel: (context) => { ... }
 *       });
 *     }
 *   };
 * `;
 *
 * // コントリビューションポイントを構築
 * const contributions = buildContributionPoints(extensionInfo, sourceCode);
 *
 * // 登録されたパネルを確認
 * console.log(contributions.panels);
 * ```
 */
export declare function buildContributionPoints(extension: ExtensionInfo, unwrappedExtensionSource: string): ContributionPoints;
