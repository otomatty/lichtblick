// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
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
const OsContextSingleton = global.ctxbridge;
export default OsContextSingleton;
