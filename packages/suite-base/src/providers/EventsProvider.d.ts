import { ReactNode } from "react";
/**
 * EventsProvider
 *
 * タイムラインイベントの管理を行うProviderコンポーネントです。
 * Zustandストアを使用してイベントの状態を管理し、子コンポーネントに
 * イベントの取得・フィルタリング・選択機能を提供します。
 *
 * ## 主な機能
 * - タイムラインイベントの状態管理
 * - イベントの非同期取得とローディング状態管理
 * - イベントフィルタリング機能
 * - 個別イベントの選択・選択解除
 * - デバイス固有のイベント管理
 * - イベント機能のサポート状態管理
 *
 * ## 使用場面
 * - タイムラインビューでのイベント表示
 * - イベントログの管理
 * - デバッグ用のイベント追跡
 * - ユーザーインタラクションの記録
 * - システムイベントの監視
 *
 * ## 状態管理
 * - `eventFetchCount`: イベント再取得のトリガー
 * - `events`: イベントデータと読み込み状態
 * - `filter`: イベントフィルタリング条件
 * - `selectedEventId`: 選択中のイベント
 * - `eventsSupported`: イベント機能の利用可否
 * - `deviceId`: 関連デバイスの識別子
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子コンポーネント
 * @returns React.JSX.Element
 *
 * @example
 * ```typescript
 * // アプリケーションでの使用
 * <EventsProvider>
 *   <TimelineView />
 *   <EventLog />
 * </EventsProvider>
 *
 * // 子コンポーネントでの使用
 * const eventsStore = useContext(EventsContext);
 * const events = eventsStore.getState().events;
 * const refreshEvents = eventsStore.getState().refreshEvents;
 *
 * // イベントを取得
 * useEffect(() => {
 *   refreshEvents();
 * }, []);
 * ```
 */
export default function EventsProvider({ children }: {
    children?: ReactNode;
}): React.JSX.Element;
