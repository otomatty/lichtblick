import { jsx as _jsx } from "react/jsx-runtime";
import { useHoverValue } from "@lichtblick/suite-base/context/TimelineInteractionStateContext";
import { VerticalBarWrapper } from "./VerticalBarWrapper";
/**
 * HoverBar - チャートホバーバー表示コンポーネント
 *
 * TimeBasedChartでのマウスホバー時に垂直線を表示し、
 * 複数チャート間でのホバー位置同期を実現します。
 * React.memoによる最適化により、効率的な再レンダリングを提供します。
 */
export default React.memo(function HoverBar({ children, componentId, isPlaybackSeconds, scales, }) {
    // グローバルホバー状態から対応する値を取得
    const hoverValue = useHoverValue({ componentId, isPlaybackSeconds });
    return (_jsx(VerticalBarWrapper, { scales: scales, xValue: hoverValue?.value, children: children }));
});
