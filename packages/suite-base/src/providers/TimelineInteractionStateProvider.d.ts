import { ReactNode } from "react";
/**
 * TimelineInteractionStateProvider
 *
 * タイムラインの相互作用状態を管理するProviderコンポーネントです。
 * ホバー値、イベント選択、グローバル境界などのタイムライン関連の
 * ユーザーインタラクション状態を一元管理します。
 *
 * ## 主な機能
 * - ホバー値の管理（マウスカーソル位置の時間値）
 * - イベントホバー状態の管理
 * - タイムライングローバル境界の管理
 * - ホバー位置にあるイベントの管理
 * - コンポーネント間での状態同期
 *
 * ## 管理される状態
 * - **hoverValue**: 現在のホバー値（時間、位置等）
 * - **hoveredEvent**: ホバーされているイベント
 * - **eventsAtHoverValue**: ホバー位置にあるイベント群
 * - **globalBounds**: タイムラインの表示範囲
 *
 * ## 使用場面
 * - タイムラインコンポーネントでのマウス追跡
 * - イベント表示の同期
 * - 複数パネル間でのタイムライン状態共有
 * - ホバー時の詳細情報表示
 * - タイムライン範囲の同期
 *
 * ## パフォーマンス最適化
 * - lodashによる効率的な等価性チェック
 * - 同じ値の場合はオブジェクト参照を保持
 * - イベントIDによる高速なキー検索
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子コンポーネント
 * @returns React.JSX.Element
 *
 * @example
 * ```typescript
 * // アプリケーションでの使用
 * <TimelineInteractionStateProvider>
 *   <Timeline />
 *   <EventPanel />
 *   <TimelineCursor />
 * </TimelineInteractionStateProvider>
 *
 * // 子コンポーネントでの使用
 * const timelineState = useContext(TimelineInteractionStateContext);
 *
 * // ホバー値を設定
 * const handleMouseMove = (timeValue: number) => {
 *   timelineState.getState().setHoverValue({
 *     componentId: 'timeline-main',
 *     type: 'PLAYBACK_SECONDS',
 *     value: timeValue
 *   });
 * };
 *
 * // イベントをホバー
 * const handleEventHover = (event: TimelinePositionedEvent) => {
 *   timelineState.getState().setHoveredEvent(event);
 * };
 *
 * // ホバー値をクリア
 * const handleMouseLeave = () => {
 *   timelineState.getState().clearHoverValue('timeline-main');
 * };
 * ```
 */
export default function TimelineInteractionStateProvider({ children, }: {
    children?: ReactNode;
}): React.JSX.Element;
