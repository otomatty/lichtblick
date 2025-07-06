// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext } from "react";
import { useStore } from "zustand";
import { useGuaranteedContext } from "@lichtblick/hooks";
/**
 * ## ExtensionCatalogContext
 *
 * **拡張機能カタログ管理のContext**
 *
 * ### 概要
 * - 拡張機能の統合管理を提供
 * - Zustandストアによる状態管理
 * - 拡張機能のライフサイクル全体を管理
 *
 * ### 管理対象
 * - **拡張機能**: インストール・アンインストール
 * - **パネル**: カスタムパネルの登録・管理
 * - **コンバーター**: メッセージ変換機能
 * - **設定**: パネル設定とカスタマイズ
 * - **モデル**: カメラモデルとトピック別名
 *
 * @see ExtensionCatalog - 拡張機能カタログインターフェース
 * @see ExtensionInfo - 拡張機能基本情報
 * @see ContributionPoints - 拡張ポイント定義
 */
export const ExtensionCatalogContext = createContext(undefined);
/**
 * ## useExtensionCatalog
 *
 * **拡張機能カタログにアクセスするためのカスタムフック**
 *
 * ### 概要
 * - ExtensionCatalogContextからZustandストアを取得
 * - セレクター関数による効率的な状態選択
 * - 拡張機能の状態管理と操作を提供
 *
 * ### 使用例
 * ```typescript
 * // 全状態の取得
 * const catalog = useExtensionCatalog((state) => state);
 *
 * // 特定の状態のみ選択
 * const installedPanels = useExtensionCatalog((state) => state.installedPanels);
 * const loadedExtensions = useExtensionCatalog((state) => state.loadedExtensions);
 *
 * // 拡張機能の操作
 * function ExtensionManagerComponent() {
 *   const {
 *     installedExtensions,
 *     installExtensions,
 *     uninstallExtension,
 *     refreshAllExtensions
 *   } = useExtensionCatalog((state) => ({
 *     installedExtensions: state.installedExtensions,
 *     installExtensions: state.installExtensions,
 *     uninstallExtension: state.uninstallExtension,
 *     refreshAllExtensions: state.refreshAllExtensions
 *   }));
 *
 *   const handleInstall = async (extensionData: Uint8Array) => {
 *     const results = await installExtensions("user", [extensionData]);
 *     if (results[0]?.success) {
 *       console.log("Extension installed successfully");
 *     }
 *   };
 *
 *   const handleUninstall = async (extensionId: string) => {
 *     await uninstallExtension("user", extensionId);
 *     console.log("Extension uninstalled");
 *   };
 *
 *   return (
 *     <div>
 *       <h2>Installed Extensions</h2>
 *       {installedExtensions?.map(ext => (
 *         <div key={ext.id}>
 *           <span>{ext.name}</span>
 *           <button onClick={() => handleUninstall(ext.id)}>
 *             Uninstall
 *           </button>
 *         </div>
 *       ))}
 *       <button onClick={refreshAllExtensions}>
 *         Refresh All
 *       </button>
 *     </div>
 *   );
 * }
 *
 * // パネル一覧の取得
 * function PanelListComponent() {
 *   const panels = useExtensionCatalog((state) => state.installedPanels);
 *
 *   return (
 *     <div>
 *       {Object.entries(panels || {}).map(([id, panel]) => (
 *         <div key={id}>
 *           <h3>{panel.registration.name}</h3>
 *           <p>Extension: {panel.extensionName}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * ### パフォーマンス最適化
 * - セレクター関数による必要な状態のみの選択
 * - 状態変更時の効率的な再レンダリング
 * - Zustandの最適化機能を活用
 *
 * @template T - セレクター関数の戻り値の型
 * @param selector - 状態から必要な値を選択する関数
 * @returns {T} 選択された状態の値
 */
export function useExtensionCatalog(selector) {
    const context = useGuaranteedContext(ExtensionCatalogContext);
    return useStore(context, selector);
}
/**
 * ## getExtensionPanelSettings
 *
 * **拡張機能のパネル設定を取得するヘルパー関数**
 *
 * ### 概要
 * - ExtensionCatalogからパネル設定を抽出
 * - 型安全なパネル設定の取得
 * - 設定が未定義の場合のフォールバック
 *
 * ### 使用例
 * ```typescript
 * function PanelSettingsComponent() {
 *   const catalog = useExtensionCatalog((state) => state);
 *   const panelSettings = getExtensionPanelSettings(catalog);
 *
 *   return (
 *     <div>
 *       {Object.entries(panelSettings).map(([extensionId, settings]) => (
 *         <div key={extensionId}>
 *           <h3>Extension: {extensionId}</h3>
 *           {Object.entries(settings).map(([panelId, panelSetting]) => (
 *             <div key={panelId}>
 *               <h4>Panel: {panelId}</h4>
 *             </div>
 *           ))}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @param reg - 拡張機能カタログ
 * @returns パネル設定の辞書（拡張機能ID -> パネルID -> 設定）
 */
export function getExtensionPanelSettings(reg) {
    return reg.panelSettings ?? {};
}
