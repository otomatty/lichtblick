// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext, useContext } from "react";
/**
 * 注入可能な機能のキー定義
 *
 * 現在サポートされている機能:
 * - customSceneExtensions: 3Dシーン拡張のカスタマイズ
 */
export const INJECTED_FEATURE_KEYS = {
    customSceneExtensions: "ThreeDeeRender.customSceneExtensions",
};
/**
 * AppContext - デフォルト値付きでコンテキストを作成
 *
 * デフォルト実装:
 * - wrapPlayer: パススルー（何も変更しない）
 */
const AppContext = createContext({
    // Default wrapPlayer is a no-op and is a pass-through of the provided child player
    wrapPlayer: (child) => child,
});
AppContext.displayName = "AppContext";
/**
 * useAppContext - AppContextの値を取得するカスタムフック
 *
 * @returns IAppContext - アプリケーションコンテキストの値
 *
 * 使用例:
 * ```typescript
 * const { wrapPlayer, layoutBrowser } = useAppContext();
 * const wrappedPlayer = wrapPlayer(basePlayer);
 * ```
 */
export function useAppContext() {
    return useContext(AppContext);
}
export { AppContext };
