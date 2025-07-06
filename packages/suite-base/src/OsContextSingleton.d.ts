/**
 * @fileoverview OS固有の機能にアクセスするためのシングルトンコンテキスト
 *
 * 【主な役割】
 * - Electron Context Bridge経由でOS固有の機能にアクセス
 * - プラットフォーム情報（Windows/Mac/Linux）の取得
 * - 環境変数、ホスト名、ネットワークインターフェースの取得
 * - アプリケーションバージョン情報の取得
 *
 * 【使用箇所】
 * - Ros1Player.ts: ROS接続時のホスト名取得
 * - Ros1SocketDataSourceFactory.ts: ROS設定のデフォルト値取得
 * - AppSettingsDialog/settings.tsx: ROS_PACKAGE_PATH環境変数の取得
 *
 * 【処理の流れ】
 * 1. Electronのメインプロセスが`ctxbridge`をグローバルに設定
 * 2. レンダラープロセスからこのシングルトンを通じてアクセス
 * 3. Web版では`undefined`となり、OS固有機能は利用不可
 *
 * 【特徴】
 * - デスクトップ版（Electron）でのみ利用可能
 * - Web版では`undefined`が返される
 * - グローバルオブジェクトを介してElectron Context Bridgeにアクセス
 * - セキュリティ上の理由でElectron Context Bridge経由でのみアクセス可能
 */
import type { OsContext } from "@lichtblick/suite-base/OsContext";
/**
 * Electron Context Bridge経由で提供されるOsContextのグローバルシングルトン
 *
 * このシングルトンは以下の場合に値を持つ：
 * - デスクトップ版（Electron）で実行されている場合
 * - Electronのメインプロセスが適切にContext Bridgeを設定済みの場合
 *
 * Web版では常に`undefined`となる
 *
 * @example
 * ```typescript
 * // 使用例：プラットフォーム情報の取得
 * const osContext = OsContextSingleton;
 * if (osContext) {
 *   const platform = osContext.platform; // 'darwin', 'win32', 'linux'
 *   const hostname = osContext.getHostname();
 *   const rosPackagePath = osContext.getEnvVar('ROS_PACKAGE_PATH');
 * }
 * ```
 */
declare const OsContextSingleton: OsContext | undefined;
export default OsContextSingleton;
