import { jsx as _jsx } from "react/jsx-runtime";
// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext, useState } from "react";
import { createStore, useStore } from "zustand";
import { useGuaranteedContext } from "@lichtblick/hooks";
import { generateEmptyTypesLib } from "@lichtblick/suite-base/players/UserScriptPlayer/transformerWorker/generateTypesLib";
import { ros_lib_dts } from "@lichtblick/suite-base/players/UserScriptPlayer/transformerWorker/typescript/ros";
/**
 * UserScriptStateContext - ユーザースクリプト状態コンテキスト
 *
 * Zustandストアを使用してユーザースクリプト状態を管理するコンテキスト
 */
const UserScriptStateContext = createContext(undefined);
UserScriptStateContext.displayName = "UserScriptStateContext";
/**
 * Zustandストアを作成する関数
 *
 * ユーザースクリプト状態管理のためのストアを初期化します。
 *
 * @returns UserScriptStore Zustandストア
 */
function create() {
    return createStore((set) => {
        return {
            state: {
                rosLib: ros_lib_dts, // デフォルトのROSライブラリ型定義
                typesLib: generateEmptyTypesLib(), // 空の型ライブラリを生成
                scriptStates: {}, // スクリプト状態の初期化
            },
            actions: {
                /**
                 * スクリプトの診断情報を設定
                 *
                 * TypeScriptコンパイラーからのエラーや警告を設定します。
                 * 既存の診断情報は置き換えられます。
                 *
                 * @param scriptId スクリプトID
                 * @param diagnostics 診断情報の配列
                 */
                setUserScriptDiagnostics: (scriptId, diagnostics) => {
                    set((prevState) => ({
                        state: {
                            ...prevState.state,
                            scriptStates: {
                                ...prevState.state.scriptStates,
                                [scriptId]: {
                                    logs: [],
                                    ...prevState.state.scriptStates[scriptId],
                                    diagnostics, // 診断情報を置き換え
                                },
                            },
                        },
                    }));
                },
                /**
                 * スクリプトのログを追加
                 *
                 * スクリプトの実行中に生成されたログを追加します。
                 * 既存のログに新しいログが追加されます。
                 *
                 * @param scriptId スクリプトID
                 * @param logs 追加するログの配列
                 */
                addUserScriptLogs(scriptId, logs) {
                    set((prevState) => ({
                        state: {
                            ...prevState.state,
                            scriptStates: {
                                ...prevState.state.scriptStates,
                                [scriptId]: {
                                    diagnostics: [],
                                    ...prevState.state.scriptStates[scriptId],
                                    logs: (prevState.state.scriptStates[scriptId]?.logs ?? []).concat(logs), // ログを追加
                                },
                            },
                        },
                    }));
                },
                /**
                 * スクリプトのログをクリア
                 *
                 * 指定されたスクリプトのすべてのログを削除します。
                 *
                 * @param scriptId スクリプトID
                 */
                clearUserScriptLogs(scriptId) {
                    set((prevState) => ({
                        state: {
                            ...prevState.state,
                            scriptStates: {
                                ...prevState.state.scriptStates,
                                [scriptId]: {
                                    diagnostics: [],
                                    ...prevState.state.scriptStates[scriptId],
                                    logs: [], // ログをクリア
                                },
                            },
                        },
                    }));
                },
                /**
                 * ROSライブラリを設定
                 *
                 * ユーザースクリプトで使用するROSライブラリの型定義を設定します。
                 *
                 * @param rosLib ROSライブラリの型定義文字列
                 */
                setUserScriptRosLib(rosLib) {
                    set((prevState) => ({ state: { ...prevState.state, rosLib } }));
                },
                /**
                 * 型ライブラリを設定
                 *
                 * ユーザースクリプトで使用する型ライブラリを設定します。
                 *
                 * @param typesLib 型ライブラリの定義文字列
                 */
                setUserScriptTypesLib(typesLib) {
                    set((prevState) => ({ state: { ...prevState.state, typesLib } }));
                },
            },
        };
    });
}
/**
 * UserScriptStateProvider - ユーザースクリプト状態プロバイダー
 *
 * ユーザースクリプト状態管理のコンテキストプロバイダーです。
 * アプリケーションのルートレベルで使用されます。
 *
 * @param children 子コンポーネント
 * @returns JSX.Element プロバイダーコンポーネント
 *
 * 使用例:
 * ```typescript
 * <UserScriptStateProvider>
 *   <App />
 * </UserScriptStateProvider>
 * ```
 */
export function UserScriptStateProvider({ children }) {
    const [value] = useState(() => create());
    return (_jsx(UserScriptStateContext.Provider, { value: value, children: children }));
}
/**
 * useUserScriptState - ユーザースクリプト状態を取得するカスタムフック
 *
 * @param selector ストアから値を選択するセレクター関数
 * @returns T セレクターが選択した値
 *
 * 使用例:
 * ```typescript
 * // 特定のスクリプトの診断情報を取得
 * const diagnostics = useUserScriptState(
 *   (store) => store.state.scriptStates["my-script"]?.diagnostics ?? []
 * );
 *
 * // 特定のスクリプトのログを取得
 * const logs = useUserScriptState(
 *   (store) => store.state.scriptStates["my-script"]?.logs ?? []
 * );
 *
 * // アクションを取得
 * const { addUserScriptLogs, clearUserScriptLogs } = useUserScriptState(
 *   (store) => store.actions
 * );
 *
 * // ROSライブラリを取得
 * const rosLib = useUserScriptState((store) => store.state.rosLib);
 * ```
 */
export function useUserScriptState(selector) {
    const store = useGuaranteedContext(UserScriptStateContext, "UserScriptStateContext");
    return useStore(store, selector);
}
