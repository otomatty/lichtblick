import { StoreApi } from "zustand";
import { IStudioLogsSettings } from "@lichtblick/suite-base/context/StudioLogsSettingsContext";
import { LocalStorageSaveState } from "./types";
/**
 * Studioログ設定ストアを作成する関数
 *
 * この関数は、Zustandベースのログ設定管理ストアを作成します。
 * ログチャンネルの動的管理、レベル制御、永続化対応などの
 * 高度なログ管理機能を提供します。
 *
 * ## 主な機能
 * - **グローバルログレベル制御**: アプリケーション全体のログレベル設定
 * - **チャンネル別制御**: 個別のログチャンネルの有効/無効切り替え
 * - **プレフィックス制御**: 名前プレフィックスによる一括制御
 * - **動的チャンネル管理**: 実行時に追加されるログチャンネルの自動検出
 * - **永続化対応**: LocalStorageからの設定復元
 *
 * ## ログチャンネルの管理
 * - 同一名のチャンネルは統合して管理
 * - チャンネルの有効/無効状態を自動同期
 * - 新しいチャンネルの動的追加に対応
 *
 * ## レベル制御の仕組み
 * - グローバルレベル: 全チャンネルのベースレベル
 * - チャンネル個別制御: 特定チャンネルのレベル上書き
 * - 無効化チャンネル: 警告レベル以上のみ出力
 *
 * @param initialState - LocalStorageから復元された初期状態
 * @returns Zustandストア（IStudioLogsSettings）
 *
 * @example
 * ```typescript
 * // 基本的な使用例
 * const store = createStudioLogsSettingsStore();
 *
 * // 初期状態付きで作成
 * const storeWithState = createStudioLogsSettingsStore({
 *   globalLevel: "info",
 *   disabledChannels: ["network", "debug-helper"]
 * });
 *
 * // ストアの使用
 * const state = store.getState();
 * state.setGlobalLevel("debug");
 * state.enableChannel("network");
 * ```
 */
declare function createStudioLogsSettingsStore(initialState?: LocalStorageSaveState): StoreApi<IStudioLogsSettings>;
export { createStudioLogsSettingsStore };
