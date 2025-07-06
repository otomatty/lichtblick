// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext } from "react";
import { useStore } from "zustand";
import { useGuaranteedContext } from "@lichtblick/hooks";
/**
 * ## StudioLogsSettingsContext
 *
 * **スタジオログ設定管理のContext**
 *
 * ### 概要
 * - アプリケーション全体のログ設定を統合管理
 * - Zustandストアによる状態管理
 * - 開発・デバッグ・本番環境での柔軟なログ制御
 *
 * ### 管理対象
 * - **グローバル設定**: 全体のログレベル
 * - **チャンネル設定**: 個別機能のログ制御
 * - **プレフィックス設定**: 名前空間単位の制御
 * - **動的変更**: 実行時の設定変更
 *
 * ### 設定パターン
 * - **開発環境**: 詳細なデバッグ情報
 * - **テスト環境**: 必要最小限の情報
 * - **本番環境**: エラーのみの出力
 * - **トラブルシューティング**: 特定機能の詳細ログ
 *
 * @see IStudioLogsSettings - ログ設定インターフェース
 * @see LogLevel - ログレベル定義
 * @see StudioLogConfigChannel - チャンネル設定
 */
const StudioLogsSettingsContext = createContext(undefined);
/**
 * ## useStudioLogsSettings
 *
 * **スタジオログ設定にアクセスするためのカスタムフック**
 *
 * ### 概要
 * - StudioLogsSettingsContextからZustandストアを取得
 * - ログ設定の読み取り・変更機能を提供
 * - 開発・デバッグ時の動的なログ制御を実現
 *
 * ### 使用例
 * ```typescript
 * // ログ設定管理コンポーネント
 * function LogSettingsComponent() {
 *   const logSettings = useStudioLogsSettings();
 *
 *   const handleGlobalLevelChange = (level: LogLevel) => {
 *     logSettings.setGlobalLevel(level);
 *   };
 *
 *   const handleChannelToggle = (channelName: string, enabled: boolean) => {
 *     if (enabled) {
 *       logSettings.enableChannel(channelName);
 *     } else {
 *       logSettings.disableChannel(channelName);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <h2>Log Settings</h2>
 *
 *       <div>
 *         <label>Global Level:</label>
 *         <select
 *           value={logSettings.globalLevel}
 *           onChange={(e) => handleGlobalLevelChange(e.target.value as LogLevel)}
 *         >
 *           <option value={LogLevel.DEBUG}>Debug</option>
 *           <option value={LogLevel.INFO}>Info</option>
 *           <option value={LogLevel.WARN}>Warn</option>
 *           <option value={LogLevel.ERROR}>Error</option>
 *         </select>
 *       </div>
 *
 *       <div>
 *         <h3>Channels</h3>
 *         {logSettings.channels.map(channel => (
 *           <div key={channel.name}>
 *             <label>
 *               <input
 *                 type="checkbox"
 *                 checked={channel.enabled}
 *                 onChange={(e) => handleChannelToggle(channel.name, e.target.checked)}
 *               />
 *               {channel.name}
 *             </label>
 *           </div>
 *         ))}
 *       </div>
 *
 *       <div>
 *         <h3>Quick Actions</h3>
 *         <button onClick={() => logSettings.enablePrefix("panel")}>
 *           Enable All Panel Logs
 *         </button>
 *         <button onClick={() => logSettings.disablePrefix("network")}>
 *           Disable All Network Logs
 *         </button>
 *       </div>
 *     </div>
 *   );
 * }
 *
 * // 開発者ツールコンポーネント
 * function DeveloperToolsComponent() {
 *   const logSettings = useStudioLogsSettings();
 *
 *   const enableDebugMode = () => {
 *     logSettings.setGlobalLevel(LogLevel.DEBUG);
 *     logSettings.enableChannel("player");
 *     logSettings.enableChannel("extension");
 *     logSettings.enableChannel("layout");
 *     logSettings.enableChannel("performance");
 *   };
 *
 *   const enableProductionMode = () => {
 *     logSettings.setGlobalLevel(LogLevel.ERROR);
 *     logSettings.disablePrefix("debug");
 *     logSettings.disableChannel("performance");
 *   };
 *
 *   const enableSpecificDebugging = (feature: string) => {
 *     logSettings.setGlobalLevel(LogLevel.DEBUG);
 *     logSettings.enableChannel(feature);
 *     logSettings.enablePrefix(feature);
 *   };
 *
 *   return (
 *     <div>
 *       <h2>Developer Tools</h2>
 *
 *       <div>
 *         <button onClick={enableDebugMode}>
 *           Enable Debug Mode
 *         </button>
 *         <button onClick={enableProductionMode}>
 *           Enable Production Mode
 *         </button>
 *       </div>
 *
 *       <div>
 *         <h3>Feature-specific Debugging</h3>
 *         <button onClick={() => enableSpecificDebugging("player")}>
 *           Debug Player
 *         </button>
 *         <button onClick={() => enableSpecificDebugging("extension")}>
 *           Debug Extensions
 *         </button>
 *         <button onClick={() => enableSpecificDebugging("layout")}>
 *           Debug Layout
 *         </button>
 *       </div>
 *
 *       <div>
 *         <h3>Current Settings</h3>
 *         <p>Global Level: {logSettings.globalLevel}</p>
 *         <p>Active Channels: {logSettings.channels.filter(ch => ch.enabled).length}</p>
 *       </div>
 *     </div>
 *   );
 * }
 *
 * // ログ出力コンポーネント（デバッグ用）
 * function LogOutputComponent() {
 *   const logSettings = useStudioLogsSettings();
 *   const [logs, setLogs] = React.useState<string[]>([]);
 *
 *   const addLog = (level: LogLevel, channel: string, message: string) => {
 *     const channelConfig = logSettings.channels.find(ch => ch.name === channel);
 *
 *     // チャンネルが無効化されている場合はスキップ
 *     if (!channelConfig?.enabled) return;
 *
 *     // グローバルレベルより低い場合はスキップ
 *     if (level < logSettings.globalLevel) return;
 *
 *     const timestamp = new Date().toISOString();
 *     const logEntry = `[${timestamp}] [${level}] [${channel}] ${message}`;
 *     setLogs(prev => [...prev.slice(-99), logEntry]); // 最新100件を保持
 *   };
 *
 *   return (
 *     <div>
 *       <h2>Log Output</h2>
 *       <div style={{ height: "300px", overflow: "auto", border: "1px solid #ccc" }}>
 *         {logs.map((log, index) => (
 *           <div key={index} style={{ fontFamily: "monospace", fontSize: "12px" }}>
 *             {log}
 *           </div>
 *         ))}
 *       </div>
 *
 *       <div>
 *         <h3>Test Logs</h3>
 *         <button onClick={() => addLog(LogLevel.DEBUG, "player", "Player state changed")}>
 *           Add Player Debug
 *         </button>
 *         <button onClick={() => addLog(LogLevel.INFO, "extension", "Extension loaded")}>
 *           Add Extension Info
 *         </button>
 *         <button onClick={() => addLog(LogLevel.WARN, "network", "Connection timeout")}>
 *           Add Network Warning
 *         </button>
 *         <button onClick={() => addLog(LogLevel.ERROR, "system", "System error occurred")}>
 *           Add System Error
 *         </button>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * ### パフォーマンス最適化
 * - 無効化されたチャンネルの早期リターン
 * - ログレベルによる処理スキップ
 * - 文字列フォーマットの遅延評価
 * - メモリ効率的なログバッファ管理
 *
 * ### 本番環境での使用
 * - エラーレベルのみの出力
 * - 機密情報の除外
 * - ログローテーション
 * - リモートログ送信
 *
 * @returns {IStudioLogsSettings} スタジオログ設定インターフェース
 */
function useStudioLogsSettings() {
    const context = useGuaranteedContext(StudioLogsSettingsContext);
    return useStore(context);
}
export { StudioLogsSettingsContext, useStudioLogsSettings };
