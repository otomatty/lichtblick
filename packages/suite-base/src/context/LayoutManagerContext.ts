// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { createContext, useContext } from "react";

import { ILayoutManager } from "@lichtblick/suite-base/services/ILayoutManager";

/**
 * ## LayoutManagerContext
 *
 * **レイアウト管理の高レベルインターフェースを提供するContext**
 *
 * ### 概要
 * - レイアウトストレージの上位レイヤーとして動作
 * - ユーザーがアプリケーションで実行可能なレイアウト操作を抽象化
 * - ローカル・リモートレイアウトの同期管理
 * - レイアウトの権限管理（共有・個人）
 *
 * ### 主な機能
 * - **レイアウトCRUD操作**: 作成、読み取り、更新、削除
 * - **レイアウト同期**: ローカル・リモート間の同期状態管理
 * - **権限管理**: CREATOR_WRITE, ORG_READ, ORG_WRITE
 * - **状態監視**: busy, online, error状態の管理
 * - **イベント通知**: レイアウト変更の通知機能
 *
 * ### 使用例
 * ```typescript
 * // レイアウト管理の基本操作
 * const layoutManager = useLayoutManager();
 *
 * // レイアウト一覧取得
 * const layouts = await layoutManager.getLayouts();
 *
 * // 新しいレイアウトの保存
 * const newLayout = await layoutManager.saveNewLayout({
 *   name: "My Custom Layout",
 *   data: layoutData,
 *   permission: "CREATOR_WRITE"
 * });
 *
 * // レイアウト更新
 * const updatedLayout = await layoutManager.updateLayout({
 *   id: "layout-123",
 *   name: "Updated Layout",
 *   data: newLayoutData
 * });
 *
 * // レイアウト削除
 * await layoutManager.deleteLayout({ id: "layout-123" });
 *
 * // 状態監視
 * const isBusy = layoutManager.isBusy;
 * const isOnline = layoutManager.isOnline;
 * const error = layoutManager.error;
 *
 * // イベントリスナー登録
 * layoutManager.on("change", (event) => {
 *   console.log("Layout changed:", event.updatedLayout);
 * });
 * ```
 *
 * ### アーキテクチャ
 * - **Service Layer**: ILayoutManagerインターフェースを実装
 * - **Storage Layer**: ILayoutStorage + IRemoteLayoutStorageと連携
 * - **Cache Layer**: WriteThroughLayoutCacheでパフォーマンス最適化
 * - **Sync Layer**: ローカル・リモート間の同期ロジック
 *
 * ### 権限システム
 * - **CREATOR_WRITE**: 作成者のみ編集可能（個人レイアウト）
 * - **ORG_READ**: 組織内読み取り専用（共有レイアウト）
 * - **ORG_WRITE**: 組織内編集可能（共有レイアウト）
 *
 * ### 同期状態
 * - **new**: 新規作成（未同期）
 * - **updated**: 更新済み（同期待ち）
 * - **tracked**: 同期済み
 * - **locally-deleted**: ローカル削除済み
 * - **remotely-deleted**: リモート削除済み
 *
 * @see ILayoutManager - レイアウト管理インターフェース
 * @see ILayoutStorage - レイアウトストレージインターフェース
 * @see IRemoteLayoutStorage - リモートレイアウトストレージインターフェース
 */
const LayoutManagerContext = createContext<ILayoutManager | undefined>(undefined);
LayoutManagerContext.displayName = "LayoutManagerContext";

/**
 * ## useLayoutManager
 *
 * **レイアウト管理機能にアクセスするためのカスタムフック**
 *
 * ### 概要
 * - LayoutManagerContextからILayoutManagerインスタンスを取得
 * - レイアウトの高レベル操作を提供
 * - 必須のContext依存関係をチェック
 *
 * ### 使用例
 * ```typescript
 * function MyLayoutComponent() {
 *   const layoutManager = useLayoutManager();
 *
 *   const handleSaveLayout = async () => {
 *     try {
 *       const layout = await layoutManager.saveNewLayout({
 *         name: "Custom Layout",
 *         data: currentLayoutData,
 *         permission: "CREATOR_WRITE"
 *       });
 *       console.log("Layout saved:", layout.id);
 *     } catch (error) {
 *       console.error("Failed to save layout:", error);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleSaveLayout}>
 *       Save Layout
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns {ILayoutManager} レイアウト管理インターフェース
 * @throws {Error} LayoutManagerProviderが設定されていない場合
 */
export function useLayoutManager(): ILayoutManager {
  const ctx = useContext(LayoutManagerContext);
  if (ctx == undefined) {
    throw new Error("A LayoutManager provider is required to useLayoutManager");
  }
  return ctx;
}

export default LayoutManagerContext;
