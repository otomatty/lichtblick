// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { useCallback, useLayoutEffect, useState } from "react";
import { createStore, useStore } from "zustand";
/**
 * useMultiSelection - 複数選択機能を提供するカスタムフック
 *
 * @description
 * このフックは、リストやツリー構造での複数選択機能を提供します。
 * 一般的なOS標準の選択操作（単一選択、追加選択、範囲選択）をサポートします。
 *
 * **主要機能:**
 * - 🎯 単一選択（通常クリック）
 * - ➕ 追加選択（Ctrl/Cmd + クリック）
 * - 📏 範囲選択（Shift + クリック）
 * - 🔄 ソース変更時の自動選択クリア
 * - 📊 選択状態の効率的な管理
 *
 * **選択操作の動作:**
 *
 * **1. 単一選択（通常クリック）:**
 * - 既存の選択をクリアして、クリックしたアイテムのみを選択
 *
 * **2. 追加選択（Ctrl/Cmd + クリック）:**
 * - 既存の選択状態を保持
 * - クリックしたアイテムが選択済みの場合は選択解除
 * - 未選択の場合は選択に追加
 *
 * **3. 範囲選択（Shift + クリック）:**
 * - 最後に選択したアイテムから現在のアイテムまでの範囲を選択
 * - 既存の選択状態を保持
 * - 最後の選択がない場合は単一選択として扱う
 *
 * **状態管理:**
 * - Zustandストアによる効率的な状態管理
 * - useLayoutEffectによるソース変更の即座な検出
 * - Set構造による高速な選択状態の操作
 *
 * **使用例:**
 * ```typescript
 * const items = ['item1', 'item2', 'item3'];
 * const { selectedIndexes, onSelect } = useMultiSelection(items);
 *
 * // 単一選択
 * onSelect({ index: 0, modKey: false, shiftKey: false });
 *
 * // 追加選択
 * onSelect({ index: 1, modKey: true, shiftKey: false });
 *
 * // 範囲選択
 * onSelect({ index: 2, modKey: false, shiftKey: true });
 * ```
 *
 * **パフォーマンス最適化:**
 * - Zustandによる必要最小限の再レンダリング
 * - Set構造による高速な検索・追加・削除
 * - useCallbackによるコールバック関数の安定化
 *
 * @template T - ソース配列のアイテム型
 * @param source - 選択対象のソース配列
 * @returns 複数選択機能のインターフェース
 */
export function useMultiSelection(source) {
    // Zustandストアの作成（コンポーネントライフサイクル内で一度のみ）
    const [store] = useState(() => createStore(() => ({
        selectedIndexes: new Set(),
        lastSelectedIndex: undefined,
    })));
    // ソース変更時の選択状態クリア
    useLayoutEffect(() => {
        // Clear selection when the source changes
        store.setState({ selectedIndexes: new Set(), lastSelectedIndex: undefined });
    }, [store, source]);
    // 選択操作のコールバック関数
    const onSelect = useCallback(({ index, modKey, shiftKey }) => {
        const { lastSelectedIndex, selectedIndexes } = store.getState();
        let newSelectedIndexes;
        if (modKey) {
            // 追加選択モード（Ctrl/Cmd + クリック）
            newSelectedIndexes = new Set(selectedIndexes);
            if (newSelectedIndexes.has(index)) {
                newSelectedIndexes.delete(index);
            }
            else {
                newSelectedIndexes.add(index);
            }
        }
        else if (shiftKey && lastSelectedIndex != undefined) {
            // 範囲選択モード（Shift + クリック）
            newSelectedIndexes = new Set(selectedIndexes);
            const start = Math.min(lastSelectedIndex, index);
            const end = Math.max(lastSelectedIndex, index);
            for (let i = start; i <= end; i++) {
                newSelectedIndexes.add(i);
            }
        }
        else {
            // 単一選択モード（通常クリック）
            newSelectedIndexes = new Set([index]);
        }
        store.setState({ selectedIndexes: newSelectedIndexes, lastSelectedIndex: index });
    }, [store]);
    // 現在の選択状態をReactの状態として取得
    const { selectedIndexes } = useStore(store);
    // 選択状態の取得関数（コールバック内で使用）
    const getSelectedIndexes = useCallback(() => store.getState().selectedIndexes, [store]);
    return { selectedIndexes, onSelect, getSelectedIndexes };
}
