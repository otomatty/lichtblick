// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext } from "react";
import { useStore } from "zustand";
import { useGuaranteedContext } from "@lichtblick/hooks";
/**
 * PanelStateContext - パネル状態管理コンテキスト
 *
 * Zustandストアを使用してパネル状態を管理するコンテキスト
 */
export const PanelStateContext = createContext(undefined);
/**
 * usePanelStateStore - パネル状態ストアから値を取得するカスタムフック
 *
 * @param selector ストアから値を選択するセレクター関数
 * @returns T セレクターが選択した値
 *
 * 使用例:
 * ```typescript
 * // 特定のパネルのシーケンス番号を取得
 * const sequenceNumber = usePanelStateStore(
 *   (store) => store.sequenceNumbers["my-panel-id"] ?? 0
 * );
 *
 * // 特定のパネルの設定ツリーを取得
 * const settingsTree = usePanelStateStore(
 *   (store) => store.settingsTrees["my-panel-id"]
 * );
 *
 * // 特定のパネルのデフォルトタイトルを取得
 * const defaultTitle = usePanelStateStore(
 *   (store) => store.defaultTitles["my-panel-id"]
 * );
 *
 * // アクションを取得
 * const { incrementSequenceNumber, updateSettingsTree } = usePanelStateStore(
 *   (store) => ({
 *     incrementSequenceNumber: store.incrementSequenceNumber,
 *     updateSettingsTree: store.updateSettingsTree,
 *   })
 * );
 * ```
 */
export function usePanelStateStore(selector) {
    const context = useGuaranteedContext(PanelStateContext);
    return useStore(context, selector);
}
