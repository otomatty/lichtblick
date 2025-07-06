import { StoryObj } from "@storybook/react";
import AccountInfo from "./AccountInfo";
/**
 * AccountInfoコンポーネントのStorybookストーリー設定
 *
 * 設定内容:
 * - コンポーネントの視覚的テストとドキュメント化
 * - 異なるユーザー状態でのコンポーネント表示確認
 * - デザインシステムとの整合性検証
 */
declare const _default: {
    title: string;
    component: typeof AccountInfo;
};
export default _default;
/**
 * ログイン済みユーザーのAccountInfoコンポーネント表示ストーリー
 *
 * 表示内容:
 * - モックユーザーデータを使用したログイン状態の再現
 * - 組織情報（ID、スラッグ、表示名、各種権限フラグ）
 * - ユーザー情報（ID、メールアドレス、組織関連情報）
 * - アカウント情報表示とサインアウト機能のUI確認
 *
 * テスト観点:
 * - ユーザー情報の正しい表示
 * - レイアウトとスタイリングの確認
 * - ボタンの配置と表示状態
 */
export declare const SignedIn: StoryObj;
