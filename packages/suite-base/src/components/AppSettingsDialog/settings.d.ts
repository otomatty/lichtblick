/// <reference types="react" />
import { ToggleButtonGroupProps } from "@mui/material";
/**
 * ColorSchemeSettings - カラースキーム設定コンポーネント
 *
 * アプリケーションのカラーテーマを選択する設定UI。
 * ダーク、ライト、システム設定の3つのオプションを提供します。
 *
 * 【機能】
 * - ダークモード/ライトモードの切り替え
 * - システム設定（OS設定）に従う自動切り替え
 * - アイコン付きのトグルボタンUI
 * - 設定値の永続化
 *
 * 【UI構成】
 * - ToggleButtonGroupによる排他選択
 * - 各オプションにアイコンとラベル
 * - レスポンシブ対応のレイアウト
 *
 * @returns ColorSchemeSettingsのJSX要素
 */
export declare function ColorSchemeSettings(): React.JSX.Element;
/**
 * TimezoneSettings - タイムゾーン設定コンポーネント
 *
 * タイムスタンプ表示で使用するタイムゾーンを設定するUI。
 * システム自動検出またはマニュアル選択に対応しています。
 *
 * 【機能】
 * - システムタイムゾーンの自動検出
 * - 全世界のタイムゾーンからの選択
 * - オートコンプリート機能付きの検索
 * - タイムゾーン情報の人間が読みやすい表示
 *
 * 【UI構成】
 * - Autocompleteコンポーネントによる検索可能なドロップダウン
 * - 「システムから検出」オプション
 * - UTCオプション（常に上部に表示）
 * - 区切り線による視覚的なグループ分け
 *
 * @returns TimezoneSettingsのJSX要素
 */
export declare function TimezoneSettings(): React.ReactElement;
/**
 * TimeFormat - 時刻表示形式設定コンポーネント
 *
 * タイムスタンプの表示形式を選択する設定UI。
 * 秒形式（SEC）と時刻形式（TOD）の2つのオプションを提供します。
 *
 * 【機能】
 * - 秒形式（Unix時間）表示
 * - 時刻形式（人間が読みやすい形式）表示
 * - 実際の表示例をプレビュー
 * - レスポンシブなレイアウト対応
 *
 * 【UI構成】
 * - ToggleButtonGroupによる排他選択
 * - 各オプションで実際の表示例を表示
 * - 縦/横レイアウトの選択可能
 *
 * @param props - コンポーネントのプロパティ
 * @param props.orientation - ボタンの配置方向（vertical/horizontal）
 * @returns TimeFormatのJSX要素
 */
export declare function TimeFormat({ orientation, }: {
    orientation?: ToggleButtonGroupProps["orientation"];
}): React.ReactElement;
/**
 * LaunchDefault - 起動設定コンポーネント
 *
 * リンクを開く際のアプリケーション選択設定UI。
 * Web版、デスクトップ版、毎回確認の3つのオプションを提供します。
 *
 * 【機能】
 * - Webアプリケーションでの起動
 * - デスクトップアプリケーションでの起動
 * - 毎回確認する設定
 * - 設定値の検証とサニタイズ
 *
 * 【UI構成】
 * - ToggleButtonGroupによる排他選択
 * - 各オプションにアイコンとラベル
 * - 不正な値の自動補正
 *
 * @returns LaunchDefaultのJSX要素
 */
export declare function LaunchDefault(): React.ReactElement;
/**
 * MessageFramerate - メッセージレート設定コンポーネント
 *
 * メッセージの更新頻度（Hz）を設定するUI。
 * 1Hzから60Hzまでの段階的な選択肢を提供します。
 *
 * 【機能】
 * - メッセージ更新頻度の設定
 * - 1-60Hzの段階的選択肢
 * - デフォルト値60Hzの自動設定
 * - パフォーマンスへの影響を考慮した選択肢
 *
 * 【UI構成】
 * - Selectコンポーネントによるドロップダウン選択
 * - Hz単位での表示
 * - 数値のみのシンプルな表示
 *
 * @returns MessageFramerateのJSX要素
 */
export declare function MessageFramerate(): React.ReactElement;
/**
 * AutoUpdate - 自動更新設定コンポーネント
 *
 * デスクトップ版アプリケーションの自動更新機能を制御するUI。
 * ユーザーが自動更新の有効/無効を選択できます。
 *
 * 【機能】
 * - 自動更新の有効/無効切り替え
 * - デスクトップ版専用機能
 * - デフォルトで有効化
 * - セキュリティアップデートの自動適用
 *
 * 【UI構成】
 * - チェックボックスによる単純なON/OFF
 * - 説明的なラベルテキスト
 * - 他の設定項目との一貫したスタイル
 *
 * @returns AutoUpdateのJSX要素
 */
export declare function AutoUpdate(): React.ReactElement;
/**
 * RosPackagePath - ROSパッケージパス設定コンポーネント
 *
 * デスクトップ版でのROS_PACKAGE_PATH環境変数を設定するUI。
 * ROSパッケージの検索パスをカスタマイズできます。
 *
 * 【機能】
 * - ROS_PACKAGE_PATH環境変数の設定
 * - システム環境変数のプレースホルダー表示
 * - デスクトップ版専用機能
 * - パッケージ検索パスのカスタマイズ
 *
 * 【UI構成】
 * - TextFieldによる自由入力
 * - システム値をプレースホルダーとして表示
 * - フルワイドレイアウト
 *
 * @returns RosPackagePathのJSX要素
 */
export declare function RosPackagePath(): React.ReactElement;
/**
 * LanguageSettings - 言語設定コンポーネント
 *
 * アプリケーションの表示言語を選択するUI。
 * 現在は英語のみサポート、将来的に多言語対応予定です。
 *
 * 【機能】
 * - アプリケーション言語の選択
 * - リアルタイムな言語切り替え
 * - 設定値の永続化
 * - エラーハンドリング付きの言語変更
 *
 * 【UI構成】
 * - Selectコンポーネントによるドロップダウン選択
 * - 言語名の表示
 * - デフォルト英語設定
 *
 * 【将来の拡張】
 * - 日本語、中国語、フランス語等の追加予定
 * - 地域固有の設定（日付形式、数値形式等）
 *
 * @returns LanguageSettingsのJSX要素
 */
export declare function LanguageSettings(): React.ReactElement;
