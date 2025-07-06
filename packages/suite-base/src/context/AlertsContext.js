// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext } from "react";
import { useStore } from "zustand";
import { useGuaranteedContext } from "@lichtblick/hooks";
/**
 * ## AlertsContext
 *
 * **アラート管理のContext**
 *
 * ### 概要
 * - アプリケーション全体のアラート表示を管理
 * - Zustandストアを使用した状態管理
 * - タグベースのアラート識別
 *
 * ### 使用例
 * ```typescript
 * const actions = useAlertsActions();
 *
 * // アラート設定
 * actions.setAlert("error", {
 *   message: "エラーが発生しました",
 *   severity: "error"
 * });
 *
 * // アラート削除
 * actions.clearAlert("error");
 * ```
 */
export const AlertsContext = createContext(undefined);
AlertsContext.displayName = "AlertsContext";
/**
 * アラートストアから値を取得するカスタムフック
 *
 * @param selector - ストアから値を選択する関数
 * @returns T - 選択された値
 */
export function useAlertsStore(selector) {
    const context = useGuaranteedContext(AlertsContext);
    return useStore(context, selector);
}
const selectActions = (store) => store.actions;
/**
 * アラートアクションを取得するカスタムフック
 *
 * @returns AlertsContextStore["actions"] - アラート操作アクション
 */
export function useAlertsActions() {
    return useAlertsStore(selectActions);
}
