import { ReactNode } from "react";
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
export default function AlertsContextProvider({ children, }: {
    children?: ReactNode;
}): React.JSX.Element;
