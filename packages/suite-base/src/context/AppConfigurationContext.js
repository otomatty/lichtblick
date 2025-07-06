// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext, useContext } from "react";
/**
 * ## AppConfigurationContext
 *
 * **アプリケーション設定管理のContext**
 *
 * ### 概要
 * - アプリケーション全体の設定管理を提供
 * - プラットフォーム固有の設定実装を抽象化
 * - 設定の永続化と同期を管理
 *
 * ### 設定の永続化
 * - **Web**: LocalStorage, IndexedDB
 * - **Desktop**: ファイルシステム, レジストリ
 * - **Mobile**: Native Storage API
 *
 * ### 設定カテゴリ
 * - **UI設定**: テーマ、言語、レイアウト
 * - **動作設定**: 自動保存、タイムアウト、デバッグ
 * - **ユーザー設定**: 最近使用したファイル、お気に入り
 * - **システム設定**: 接続情報、キャッシュ設定
 *
 * @see IAppConfiguration - 設定管理インターフェース
 */
const AppConfigurationContext = createContext(undefined);
AppConfigurationContext.displayName = "AppConfigurationContext";
/**
 * ## useAppConfiguration
 *
 * **アプリケーション設定機能にアクセスするためのカスタムフック**
 *
 * ### 概要
 * - AppConfigurationContextからIAppConfigurationインスタンスを取得
 * - 設定の読み取り・書き込み・監視機能を提供
 * - 必須のContext依存関係をチェック
 *
 * ### 使用例
 * ```typescript
 * function SettingsComponent() {
 *   const config = useAppConfiguration();
 *   const [theme, setTheme] = React.useState(() => config.get("theme") || "light");
 *
 *   // 設定変更の監視
 *   React.useEffect(() => {
 *     const handleThemeChange = (newValue: AppConfigurationValue) => {
 *       setTheme(newValue as string || "light");
 *     };
 *
 *     config.addChangeListener("theme", handleThemeChange);
 *
 *     return () => {
 *       config.removeChangeListener("theme", handleThemeChange);
 *     };
 *   }, [config]);
 *
 *   // 設定の更新
 *   const handleThemeToggle = async () => {
 *     const newTheme = theme === "light" ? "dark" : "light";
 *     await config.set("theme", newTheme);
 *   };
 *
 *   return (
 *     <div>
 *       <div>Current Theme: {theme}</div>
 *       <button onClick={handleThemeToggle}>
 *         Toggle Theme
 *       </button>
 *     </div>
 *   );
 * }
 *
 * // 設定フォームの例
 * function ConfigurationForm() {
 *   const config = useAppConfiguration();
 *
 *   const handleSubmit = async (formData: Record<string, any>) => {
 *     try {
 *       await Promise.all([
 *         config.set("autoSave", formData.autoSave),
 *         config.set("connectionTimeout", formData.timeout),
 *         config.set("language", formData.language),
 *       ]);
 *       console.log("Settings saved successfully");
 *     } catch (error) {
 *       console.error("Failed to save settings:", error);
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *     </form>
 *   );
 * }
 * ```
 *
 * ### 注意点
 * - 設定値の型は呼び出し側で適切にキャストする必要がある
 * - 変更リスナーは必ずクリーンアップすること
 * - 設定の更新は非同期処理のため、エラーハンドリングが重要
 *
 * @returns {IAppConfiguration} アプリケーション設定インターフェース
 * @throws {Error} AppConfigurationProviderが設定されていない場合
 */
export function useAppConfiguration() {
    const storage = useContext(AppConfigurationContext);
    if (!storage) {
        throw new Error("An AppConfigurationContext provider is required to useAppConfiguration");
    }
    return storage;
}
export default AppConfigurationContext;
