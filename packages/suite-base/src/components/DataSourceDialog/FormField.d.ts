/// <reference types="react" />
import { Field } from "@lichtblick/suite-base/context/PlayerSelectionContext";
/**
 * FormField コンポーネントのプロパティ型定義
 *
 * @interface Props
 * @property {boolean} disabled - フィールドの無効状態
 * @property {Field} field - フィールド設定オブジェクト
 * @property {function} onChange - 値変更時のコールバック関数
 * @property {function} onError - エラー発生時のコールバック関数
 */
type Props = {
    disabled: boolean;
    field: Field;
    onChange: (newValue: string | undefined) => void;
    onError: (message: string) => void;
};
/**
 * 動的フォームフィールドコンポーネント
 *
 * このコンポーネントは、データソース接続設定で使用される動的フォームの
 * 個別フィールドを表示・管理します。各接続タイプに応じて異なるフィールド
 * 設定を受け取り、統一されたUIで表示します。
 *
 * ## 主な機能
 *
 * ### 動的フィールド生成
 * - Field オブジェクトに基づいた動的なフォーム要素の生成
 * - ラベル、プレースホルダー、デフォルト値の自動設定
 * - フィールドタイプに応じたUI調整
 *
 * ### リアルタイムバリデーション
 * - 入力値の即座な検証
 * - カスタムバリデーション関数の実行
 * - エラーメッセージの表示とフィードバック
 *
 * ### エラーハンドリング
 * - バリデーションエラーの視覚的表示
 * - 親コンポーネントへのエラー状態通知
 * - エラー解消時の自動クリア
 *
 * ### Material-UI統合
 * - 統一されたデザインシステムの適用
 * - アクセシビリティ対応
 * - レスポンシブデザイン
 *
 * ## フィールド設定 (Field オブジェクト)
 *
 * ### 基本プロパティ
 * - **label**: フィールドラベル
 * - **placeholder**: プレースホルダーテキスト
 * - **defaultValue**: デフォルト値
 * - **description**: フィールドの説明文
 *
 * ### バリデーション
 * - **validate**: カスタムバリデーション関数
 *   - 入力値を受け取り、Error オブジェクトまたは undefined を返す
 *   - エラー時は Error.message がユーザーに表示される
 *
 * ## 使用例
 *
 * ### 基本的な使用方法
 * ```tsx
 * const urlField = {
 *   id: "url",
 *   label: "WebSocket URL",
 *   placeholder: "ws://localhost:9090",
 *   defaultValue: "",
 *   description: "WebSocket server URL to connect to",
 *   validate: (value) => {
 *     if (!value) return new Error("URL is required");
 *     if (!value.startsWith("ws://") && !value.startsWith("wss://")) {
 *       return new Error("URL must start with ws:// or wss://");
 *     }
 *     return undefined;
 *   }
 * };
 *
 * <FormField
 *   field={urlField}
 *   disabled={false}
 *   onChange={(value) => setFormData({...formData, url: value})}
 *   onError={(error) => setErrors({...errors, url: error})}
 * />
 * ```
 *
 * ### 接続設定での使用例
 * ```tsx
 * // ROS接続の場合
 * const rosFields = [
 *   {
 *     id: "url",
 *     label: "ROS Bridge URL",
 *     placeholder: "ws://localhost:9090",
 *     validate: validateWebSocketUrl
 *   },
 *   {
 *     id: "timeout",
 *     label: "Connection Timeout",
 *     placeholder: "10000",
 *     description: "Timeout in milliseconds",
 *     validate: validatePositiveNumber
 *   }
 * ];
 * ```
 *
 * ## バリデーション処理フロー
 *
 * 1. **入力値変更**: ユーザーがフィールドに入力
 * 2. **エラークリア**: 既存のエラー状態をクリア
 * 3. **バリデーション実行**: field.validate 関数を呼び出し
 * 4. **エラー処理**:
 *    - エラーあり: エラーメッセージを表示、親にエラー通知
 *    - エラーなし: 親に新しい値を通知
 * 5. **UI更新**: エラー状態に応じたスタイル適用
 *
 * ## エラー表示
 *
 * ### 視覚的インジケーター
 * - テキストフィールドの赤色ボーダー
 * - エラーメッセージの表示
 * - Material-UI の error プロパティによる統一されたスタイル
 *
 * ### エラーメッセージの種類
 * - **バリデーションエラー**: フィールド直下に表示
 * - **フィールド説明**: 常に表示される補助テキスト
 *
 * ## アクセシビリティ
 *
 * - **ラベル関連付け**: TextField の label プロパティによる適切な関連付け
 * - **エラー通知**: スクリーンリーダーによるエラー状態の読み上げ
 * - **フォーカス管理**: キーボードナビゲーション対応
 *
 * ## レスポンシブデザイン
 *
 * - **fullWidth**: 親コンテナの幅に合わせた自動調整
 * - **Material-UI Grid**: 親レイアウトとの統合
 * - **モバイル対応**: タッチデバイスでの使いやすさ
 *
 * @param props - コンポーネントプロパティ
 * @returns 動的フォームフィールドのReactコンポーネント
 *
 * @example
 * ```tsx
 * // 接続URL入力フィールド
 * <FormField
 *   field={{
 *     id: "url",
 *     label: "Server URL",
 *     placeholder: "https://api.example.com",
 *     description: "Enter the server URL to connect to",
 *     validate: (value) => {
 *       if (!value) return new Error("URL is required");
 *       try {
 *         new URL(value);
 *         return undefined;
 *       } catch {
 *         return new Error("Invalid URL format");
 *       }
 *     }
 *   }}
 *   disabled={isConnecting}
 *   onChange={(value) => updateConnectionConfig("url", value)}
 *   onError={(error) => setFieldError("url", error)}
 * />
 * ```
 */
export declare function FormField(props: Props): React.JSX.Element;
export {};
