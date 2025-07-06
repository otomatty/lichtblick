// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext } from "react";
import { useStore } from "zustand";
import { useGuaranteedContext } from "@lichtblick/hooks";
/**
 * サイドバーアイテムキーの定義
 *
 * アプリケーション全体で使用されるサイドバーアイテムの識別子
 */
export const SidebarItemKeys = [
    "account", // アカウント管理
    "add-panel", // パネル追加
    "app-bar-tour", // アプリバーツアー
    "app-settings", // アプリケーション設定
    "connection", // 接続管理
    "extensions", // 拡張機能
    "help", // ヘルプ
    "layouts", // レイアウト管理
    "panel-settings", // パネル設定
    "logs-settings", // ログ設定
    "variables", // 変数管理
];
/**
 * 左サイドバーアイテムキーの定義
 *
 * 左サイドバーで利用可能なアイテムの識別子
 */
export const LeftSidebarItemKeys = ["panel-settings", "topics", "alerts", "layouts"];
/**
 * 右サイドバーアイテムキーの定義
 *
 * 右サイドバーで利用可能なアイテムの識別子
 */
export const RightSidebarItemKeys = [
    "events", // イベント管理
    "variables", // 変数管理
    "logs-settings", // ログ設定
    "performance", // パフォーマンス監視
];
/**
 * WorkspaceContext - Zustandストアのコンテキスト
 *
 * ワークスペース状態管理用のZustandストアを提供するコンテキスト
 */
export const WorkspaceContext = createContext(undefined);
WorkspaceContext.displayName = "WorkspaceContext";
/**
 * WorkspaceStoreSelectors - 共通セレクター関数
 *
 * 頻繁に使用されるセレクター関数を事前定義して再利用性を向上
 */
export const WorkspaceStoreSelectors = {
    /**
     * パネル設定が開いているかを判定
     *
     * @param store ワークスペースストア
     * @returns パネル設定の開閉状態
     */
    selectPanelSettingsOpen: (store) => {
        return store.sidebars.left.open && store.sidebars.left.item === "panel-settings";
    },
};
/**
 * useWorkspaceStore - ワークスペースストアから値を取得するカスタムフック
 *
 * @param selector ストアから値を選択するセレクター関数
 * @returns セレクターが選択した値
 *
 * 使用例:
 * ```typescript
 * // 左サイドバーの開閉状態を取得
 * const leftSidebarOpen = useWorkspaceStore((store) => store.sidebars.left.open);
 *
 * // パネル設定の開閉状態を取得（事前定義セレクター使用）
 * const panelSettingsOpen = useWorkspaceStore(WorkspaceStoreSelectors.selectPanelSettingsOpen);
 * ```
 */
export function useWorkspaceStore(selector) {
    const context = useGuaranteedContext(WorkspaceContext);
    return useStore(context, selector);
}
