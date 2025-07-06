// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext, useContext } from "react";
/**
 * PlayerSelectionContext - デフォルト値付きでコンテキストを作成
 *
 * デフォルト実装:
 * - selectSource/selectRecent: 何もしない
 * - availableSources/recentSources: 空配列
 */
const PlayerSelectionContext = createContext({
    selectSource: () => { },
    selectRecent: () => { },
    availableSources: [],
    recentSources: [],
});
PlayerSelectionContext.displayName = "PlayerSelectionContext";
/**
 * usePlayerSelection - PlayerSelectionContextの値を取得するカスタムフック
 *
 * @returns PlayerSelection - プレイヤー選択コンテキストの値
 *
 * 使用例:
 * ```typescript
 * const { availableSources, selectSource } = usePlayerSelection();
 * const handleSourceSelect = (sourceId: string) => {
 *   selectSource(sourceId, { type: "connection", params: { url: "..." } });
 * };
 * ```
 */
export function usePlayerSelection() {
    return useContext(PlayerSelectionContext);
}
export default PlayerSelectionContext;
