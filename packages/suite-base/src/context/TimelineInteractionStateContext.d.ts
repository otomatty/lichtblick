/// <reference types="react" />
import { StoreApi } from "zustand";
import { Immutable } from "@lichtblick/suite";
import { TimelinePositionedEvent } from "@lichtblick/suite-base/context/EventsContext";
import type { HoverValue } from "@lichtblick/suite-base/types/hoverValue";
/**
 * 同期範囲設定
 *
 * 同期されたプロット間で共有されるグローバル範囲を表現します。
 * その範囲を設定したコンポーネントのIDも含まれます。
 */
export type SyncBounds = {
    /** 最小値 */
    min: number;
    /** 最大値 */
    max: number;
    /** この範囲を設定したコンポーネントのID */
    sourceId: string;
    /** ユーザーの直接的な操作によるものかどうか */
    userInteraction: boolean;
};
/**
 * TimelineInteractionStateStore - タイムライン相互作用状態管理
 *
 * このストアは、アプリケーション内でのデータとの動的なユーザー相互作用に
 * 関連する状態を管理します。ホバー時間値やプロットのグローバル範囲などが
 * ここで管理されます。
 *
 * 主な責任:
 * - ホバー状態の管理（時間値、イベント）
 * - 同期プロットのグローバル範囲管理
 * - タイムライン上でのイベント表示管理
 * - コンポーネント間の相互作用調整
 */
export type TimelineInteractionStateStore = Immutable<{
    /** 現在のホバー時間と重複するイベント（存在する場合） */
    eventsAtHoverValue: Record<string, TimelinePositionedEvent>;
    /** 同期プロットの共有時間範囲（存在する場合） */
    globalBounds: undefined | SyncBounds;
    /** ユーザーが直接ホバーしているイベント（存在する場合） */
    hoveredEvent: undefined | TimelinePositionedEvent;
    /** ユーザーがホバーしている時間ポイント */
    hoverValue: undefined | HoverValue;
    /** 現在のホバー値をクリアする */
    clearHoverValue: (componentId: string) => void;
    /** 現在のホバー時間と重複するイベントを設定する */
    setEventsAtHoverValue: (events: TimelinePositionedEvent[]) => void;
    /** 新しいグローバル範囲を設定する */
    setGlobalBounds: (newBounds: undefined | SyncBounds | ((oldValue: undefined | SyncBounds) => undefined | SyncBounds)) => void;
    /** 直接ホバーされているイベントを設定またはクリアする */
    setHoveredEvent: (hoveredEvent: undefined | TimelinePositionedEvent) => void;
    /** 新しいホバー値を設定する */
    setHoverValue: (value: HoverValue) => void;
}>;
/**
 * TimelineInteractionStateContext - タイムライン相互作用状態コンテキスト
 *
 * Zustandストアを使用してタイムライン相互作用状態を管理するコンテキスト
 */
export declare const TimelineInteractionStateContext: import("react").Context<StoreApi<{
    readonly eventsAtHoverValue: {
        readonly [x: string]: {
            readonly event: {
                readonly id: string;
                readonly createdAt: string;
                readonly deviceId: string;
                readonly durationNanos: string;
                readonly endTime: {
                    readonly sec: number;
                    readonly nsec: number;
                };
                readonly endTimeInSeconds: number;
                readonly metadata: {
                    readonly [x: string]: string;
                };
                readonly startTime: {
                    readonly sec: number;
                    readonly nsec: number;
                };
                readonly startTimeInSeconds: number;
                readonly timestampNanos: string;
                readonly updatedAt: string;
            };
            readonly endPosition: number;
            readonly startPosition: number;
            readonly secondsSinceStart: number;
        };
    };
    readonly globalBounds: {
        readonly min: number;
        readonly max: number;
        readonly sourceId: string;
        readonly userInteraction: boolean;
    } | undefined;
    readonly hoveredEvent: {
        readonly event: {
            readonly id: string;
            readonly createdAt: string;
            readonly deviceId: string;
            readonly durationNanos: string;
            readonly endTime: {
                readonly sec: number;
                readonly nsec: number;
            };
            readonly endTimeInSeconds: number;
            readonly metadata: {
                readonly [x: string]: string;
            };
            readonly startTime: {
                readonly sec: number;
                readonly nsec: number;
            };
            readonly startTimeInSeconds: number;
            readonly timestampNanos: string;
            readonly updatedAt: string;
        };
        readonly endPosition: number;
        readonly startPosition: number;
        readonly secondsSinceStart: number;
    } | undefined;
    readonly hoverValue: {
        readonly value: number;
        readonly componentId: string;
        readonly type: "PLAYBACK_SECONDS" | "OTHER";
    } | undefined;
    readonly clearHoverValue: (componentId: string) => void;
    readonly setEventsAtHoverValue: (events: TimelinePositionedEvent[]) => void;
    readonly setGlobalBounds: (newBounds: SyncBounds | ((oldValue: undefined | SyncBounds) => undefined | SyncBounds) | undefined) => void;
    readonly setHoveredEvent: (hoveredEvent: undefined | TimelinePositionedEvent) => void;
    readonly setHoverValue: (value: HoverValue) => void;
}> | undefined>;
/**
 * useClearHoverValue - ホバー値クリア関数を取得するカスタムフック
 *
 * @returns ホバー値をクリアする関数
 *
 * 使用例:
 * ```typescript
 * const clearHoverValue = useClearHoverValue();
 * const handleMouseLeave = () => {
 *   clearHoverValue("my-component-id");
 * };
 * ```
 */
export declare function useClearHoverValue(): TimelineInteractionStateStore["clearHoverValue"];
/**
 * useSetHoverValue - ホバー値設定関数を取得するカスタムフック
 *
 * @returns ホバー値を設定する関数
 *
 * 使用例:
 * ```typescript
 * const setHoverValue = useSetHoverValue();
 * const handleMouseMove = (time: number) => {
 *   setHoverValue({
 *     type: "PLAYBACK_SECONDS",
 *     value: time,
 *     componentId: "my-component-id"
 *   });
 * };
 * ```
 */
export declare function useSetHoverValue(): TimelineInteractionStateStore["setHoverValue"];
/**
 * useHoverValue - 現在のホバー値を取得するカスタムフック
 *
 * デフォルトでは、このフックは発生元に関係なく最新のホバー値を返します。
 * オプションを使用して、ホバー値の更新がフックに更新された値を返させる
 * タイミングを制御できます。
 *
 * @param opt.componentId このcomponentIdに一致するホバー値からの更新を許可。undefinedの場合、任意のコンポーネントのホバー値が返される
 * @param opt.disableUpdates 発生元に関係なく更新を無効化。設定されている場合、他のオプションが一致を引き起こしてもホバー値で更新されない
 * @param opt.isPlaybackSeconds PLAYBACK_SECONDSのホバー値からの更新を許可
 * @returns HoverValue | undefined 現在のホバー値
 *
 * 使用例:
 * ```typescript
 * // 任意のコンポーネントからのホバー値を取得
 * const hoverValue = useHoverValue();
 *
 * // 特定のコンポーネントからのホバー値のみを取得
 * const myHoverValue = useHoverValue({
 *   componentId: "my-component-id"
 * });
 *
 * // 再生時間ベースのホバー値のみを取得
 * const playbackHoverValue = useHoverValue({
 *   isPlaybackSeconds: true
 * });
 *
 * // 更新を無効化（静的な値として使用）
 * const staticHoverValue = useHoverValue({
 *   disableUpdates: true
 * });
 * ```
 */
export declare function useHoverValue(opt?: {
    componentId?: string;
    disableUpdates?: boolean;
    isPlaybackSeconds?: boolean;
}): HoverValue | undefined;
/**
 * useTimelineInteractionState - タイムライン相互作用状態ストアへのアクセスフック
 *
 * このフックは、相互作用状態ストアへのすべてのアクセスをラップします。
 * セレクターを渡してストアの一部にアクセスしてください。
 *
 * @param selector ストアから値を選択するセレクター関数
 * @returns T セレクターが選択した値
 *
 * 使用例:
 * ```typescript
 * // グローバル範囲を取得
 * const globalBounds = useTimelineInteractionState(
 *   (store) => store.globalBounds
 * );
 *
 * // ホバーされているイベントを取得
 * const hoveredEvent = useTimelineInteractionState(
 *   (store) => store.hoveredEvent
 * );
 *
 * // ホバー時間でのイベントを取得
 * const eventsAtHover = useTimelineInteractionState(
 *   (store) => store.eventsAtHoverValue
 * );
 * ```
 */
export declare function useTimelineInteractionState<T>(selector: (store: TimelineInteractionStateStore) => T): T;
