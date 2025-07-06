/// <reference types="react" />
import { StoreApi } from "zustand";
import { Player } from "@lichtblick/suite-base/players/types";
import { MessagePipelineInternalState } from "./store";
import { MessagePipelineContext } from "./types";
export type { MessagePipelineContext };
/**
 * MessagePipeline内部状態用Context
 * MockMessagePipelineProviderでの使用のためexportされている
 * 通常のパネルコンポーネントは直接使用せず、useMessagePipeline()を使用すること
 */
export declare const ContextInternal: import("react").Context<StoreApi<MessagePipelineInternalState> | undefined>;
/**
 * MessagePipelineゲッター関数を返すカスタムフック
 *
 * useCallbackフック内で最新のパイプライン値にアクセスしたいが、
 * 変更のたびにコールバック依存関係を無効化したくない場合に使用される。
 *
 * 主な用途：
 * - イベントハンドラー内での最新状態アクセス
 * - 非同期処理内での状態参照
 * - パフォーマンスが重要な処理での状態取得
 *
 * @returns 現在のMessagePipelineContextを返す関数
 *
 * @example
 * ```tsx
 * function MyPanel() {
 *   const getMessagePipeline = useMessagePipelineGetter();
 *
 *   const handleClick = useCallback(() => {
 *     const { playerState } = getMessagePipeline();
 *     console.log("Current player state:", playerState);
 *   }, []); // 依存配列が空でも最新状態にアクセス可能
 * }
 * ```
 */
export declare function useMessagePipelineGetter(): () => MessagePipelineContext;
/**
 * MessagePipelineセレクター関数を使用するカスタムフック
 *
 * MessagePipelineContextから必要な部分のみを選択的に取得し、
 * 不要な再レンダリングを防止する最適化されたフック。
 * ZustandのuseStore()をベースとした高性能な実装。
 *
 * @param selector - MessagePipelineContextから必要な値を選択する関数
 * @returns セレクター関数が返す値
 *
 * @example
 * ```tsx
 * function MyPanel() {
 *   const { playerState, setSubscriptions } = useMessagePipeline(
 *     useCallback((ctx) => ({
 *       playerState: ctx.playerState,
 *       setSubscriptions: ctx.setSubscriptions,
 *     }), [])
 *   );
 * }
 * ```
 */
export declare function useMessagePipeline<T>(selector: (arg0: MessagePipelineContext) => T): T;
/**
 * MessagePipeline状態変更購読関数を返すカスタムフック
 *
 * MessagePipelineContextの状態変更を直接監視したい場合に使用。
 * React外部からの状態監視や、カスタムエフェクト処理で活用される。
 *
 * @returns 状態変更監視関数を登録する関数
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const subscribe = useMessagePipelineSubscribe();
 *
 *   useEffect(() => {
 *     const unsubscribe = subscribe((state) => {
 *       console.log("Pipeline state changed:", state);
 *     });
 *     return unsubscribe;
 *   }, [subscribe]);
 * }
 * ```
 */
export declare function useMessagePipelineSubscribe(): (fn: (state: MessagePipelineContext) => void) => () => void;
/**
 * MessagePipelineProviderのプロパティ型定義
 */
type ProviderProps = {
    /** 子コンポーネント */
    children: React.ReactNode;
    /**
     * Player インスタンス（オプショナル）
     *
     * 以下の状態を表す：
     * - undefined: Playerが存在しない状態
     * - Player: 構築中または有効なPlayerインスタンス
     *
     * MessagePipelineProviderはPlayerの構築には責任を持たず、
     * 渡されたPlayer状態の情報をコンテキストとして下流に提供する役割を担う。
     */
    player?: Player;
};
/**
 * MessagePipelineProvider - データ処理パイプラインの中核Provider
 *
 * このコンポーネントは、Lichtblickアプリケーションにおけるデータ処理の中枢として機能し、
 * Player、パネル、状態管理システムを統合した統一的なデータアクセス層を提供する。
 *
 * ## 主要責任
 *
 * ### 1. Player統合管理
 * - Player変更時の状態クリーンアップ
 * - リスナー登録とリソース解放
 * - エラーハンドリングとアラート管理
 *
 * ### 2. サブスクリプション管理
 * - パネル別サブスクリプションの統合
 * - デバウンス処理による効率的な更新
 * - Player設定の動的更新
 *
 * ### 3. フレーム制御
 * - 設定可能なメッセージフレームレート
 * - レンダリング完了通知
 * - 非同期処理の適切な待機
 *
 * ### 4. グローバル変数管理
 * - レイアウトコンテキストとの連携
 * - 変更検出による効率的な更新
 * - Player設定の自動同期
 *
 * ## パフォーマンス最適化
 *
 * ### デバウンス処理
 * サブスクリプション更新は0msのデバウンスにより、
 * 複数の変更を1回の更新にまとめて効率化している。
 *
 * ### フレームレート制御
 * APP_SETTING.MESSAGE_RATEによりフレームレートを制御し、
 * 高頻度データの処理負荷を調整している。
 *
 * ### メモリリーク対策
 * Player変更時にストアを完全に再作成することで、
 * 前のPlayerの状態やメモリリークを防止している。
 *
 * @param props - Provider設定プロパティ
 * @returns MessagePipelineContext を提供するProvider要素
 *
 * @example
 * ```tsx
 * function App() {
 *   const [player, setPlayer] = useState<Player>();
 *
 *   return (
 *     <MessagePipelineProvider player={player}>
 *       <Workspace />
 *     </MessagePipelineProvider>
 *   );
 * }
 * ```
 */
export declare function MessagePipelineProvider({ children, player }: ProviderProps): React.ReactElement;
