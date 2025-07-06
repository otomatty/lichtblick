// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext } from "react";
import { useStore } from "zustand";
import { useGuaranteedContext } from "@lichtblick/hooks";
/**
 * EventsContext - イベント管理コンテキスト
 *
 * Zustandストアを使用してイベント状態を管理するコンテキスト
 */
export const EventsContext = createContext(undefined);
/**
 * useEvents - イベントストアから値を取得するカスタムフック
 *
 * @param selector ストアから値を選択するセレクター関数
 * @returns T セレクターが選択した値
 *
 * 使用例:
 * ```typescript
 * // 全イベントを取得
 * const events = useEvents((store) => store.events);
 *
 * // 選択されたイベントIDを取得
 * const selectedEventId = useEvents((store) => store.selectedEventId);
 *
 * // フィルター文字列を取得
 * const filter = useEvents((store) => store.filter);
 *
 * // イベント選択アクションを取得
 * const selectEvent = useEvents((store) => store.selectEvent);
 * const handleEventSelect = (eventId: string) => {
 *   selectEvent(eventId);
 * };
 * ```
 */
export function useEvents(selector) {
    const context = useGuaranteedContext(EventsContext);
    return useStore(context, selector);
}
