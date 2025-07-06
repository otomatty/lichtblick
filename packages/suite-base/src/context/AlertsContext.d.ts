/// <reference types="react" />
import { StoreApi } from "zustand";
import { Immutable } from "@lichtblick/suite";
import { PlayerAlert } from "@lichtblick/suite-base/players/types";
/**
 * セッションアラートの型定義
 *
 * プレイヤーアラートと同じ構造
 */
export type SessionAlert = PlayerAlert;
/**
 * タグ付きアラートの型定義
 *
 * アラートにタグを追加して識別可能にする
 */
type TaggedAlert = SessionAlert & {
    tag: string;
};
/**
 * アラートContextストアの型定義
 *
 * アラート一覧とアクションを含む
 */
export type AlertsContextStore = Immutable<{
    alerts: TaggedAlert[];
    actions: {
        clearAlert: (tag: string) => void;
        setAlert: (tag: string, alert: Immutable<SessionAlert>) => void;
    };
}>;
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
export declare const AlertsContext: import("react").Context<StoreApi<{
    readonly alerts: readonly {
        readonly severity: import("../util/sendNotification").NotificationSeverity;
        readonly message: string;
        readonly error?: {
            readonly name: string;
            readonly message: string;
            readonly stack?: string | undefined;
            readonly cause?: unknown;
        } | undefined;
        readonly tip?: string | undefined;
        readonly tag: string;
    }[];
    readonly actions: {
        readonly clearAlert: (tag: string) => void;
        readonly setAlert: (tag: string, alert: Immutable<SessionAlert>) => void;
    };
}> | undefined>;
/**
 * アラートストアから値を取得するカスタムフック
 *
 * @param selector - ストアから値を選択する関数
 * @returns T - 選択された値
 */
export declare function useAlertsStore<T>(selector: (store: AlertsContextStore) => T): T;
/**
 * アラートアクションを取得するカスタムフック
 *
 * @returns AlertsContextStore["actions"] - アラート操作アクション
 */
export declare function useAlertsActions(): AlertsContextStore["actions"];
export {};
