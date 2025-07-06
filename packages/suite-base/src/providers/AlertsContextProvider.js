import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { create } from "zustand";
import { AlertsContext, } from "@lichtblick/suite-base/context/AlertsContext";
/**
 * アラートストアを作成する関数
 *
 * Zustandを使用してアラートの状態管理を行うストアを作成します。
 * アラートの追加、削除、一覧管理の機能を提供します。
 *
 * @returns {StoreApi<AlertsContextStore>} アラート管理用のZustandストア
 *
 * @example
 * ```typescript
 * const store = createAlertsStore();
 * // アラートを設定
 * store.getState().actions.setAlert('warning', { message: 'Warning message' });
 * // アラートをクリア
 * store.getState().actions.clearAlert('warning');
 * ```
 */
function createAlertsStore() {
    return create((set, get) => {
        return {
            // アラートの配列（最新のものが先頭）
            alerts: [],
            actions: {
                /**
                 * 指定されたタグのアラートをクリアする
                 * @param tag - クリアするアラートのタグ
                 */
                clearAlert: (tag) => {
                    set({
                        alerts: get().alerts.filter((al) => al.tag !== tag),
                    });
                },
                /**
                 * アラートを設定または更新する
                 * 既存の同じタグのアラートがある場合は置き換えられる
                 * @param tag - アラートのタグ（識別子）
                 * @param alert - アラートの内容
                 */
                setAlert: (tag, alert) => {
                    const newAlerts = get().alerts.filter((al) => al.tag !== tag);
                    set({
                        alerts: [{ tag, ...alert }, ...newAlerts],
                    });
                },
            },
        };
    });
}
/**
 * AlertsContextProvider
 *
 * アプリケーション全体のアラート管理を行うProviderコンポーネントです。
 * Zustandストアを使用してアラートの状態を管理し、子コンポーネントに
 * アラートの追加・削除・一覧取得機能を提供します。
 *
 * ## 主な機能
 * - セッションアラートの管理（警告、エラー、情報メッセージなど）
 * - タグベースのアラート識別システム
 * - アラートの自動重複排除（同じタグのアラートは上書き）
 * - 最新のアラートを先頭に表示する順序管理
 *
 * ## 使用場面
 * - ユーザーへの通知表示
 * - エラーメッセージの一元管理
 * - 警告メッセージの表示
 * - 一時的な情報メッセージの管理
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子コンポーネント
 * @returns React.JSX.Element
 *
 * @example
 * ```typescript
 * // アプリケーションのルートで使用
 * <AlertsContextProvider>
 *   <App />
 * </AlertsContextProvider>
 *
 * // 子コンポーネントでアラートを使用
 * const alertsStore = useContext(AlertsContext);
 * const alerts = alertsStore.getState().alerts;
 * alertsStore.getState().actions.setAlert('error', {
 *   message: 'エラーが発生しました',
 *   severity: 'error'
 * });
 * ```
 */
export default function AlertsContextProvider({ children, }) {
    const [store] = useState(createAlertsStore);
    return _jsx(AlertsContext.Provider, { value: store, children: children });
}
