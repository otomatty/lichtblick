/// <reference types="react" />
import { Immutable } from "@lichtblick/suite";
import { AppParametersEnum } from "@lichtblick/suite-base/AppParameters";
/**
 * 入力パラメータの型定義
 *
 * 任意の文字列キーと文字列値を許可
 */
export type AppParametersInput = Readonly<Record<string, string>>;
/**
 * アプリケーションパラメータの型定義
 *
 * AppParametersEnum に制限されたキーを使用
 */
export type AppParameters = Readonly<Record<AppParametersEnum, string | undefined>>;
export type AppParametersContext = Immutable<AppParameters>;
/**
 * ## AppParametersContext
 *
 * **アプリケーションパラメータ管理のContext**
 *
 * ### 概要
 * - アプリケーション起動時のパラメータを管理
 * - 型安全なパラメータアクセスを提供
 * - 設定値の一元管理
 *
 * ### 使用例
 * ```typescript
 * const params = useAppParameters();
 * const debugMode = params[AppParametersEnum.DEBUG];
 * ```
 */
export declare const AppParametersContext: import("react").Context<{
    readonly defaultLayout: string | undefined;
    readonly time: string | undefined;
} | undefined>;
/**
 * アプリケーションパラメータを取得するカスタムフック
 *
 * @returns AppParameters - アプリケーションパラメータ
 * @throws Error - プロバイダーが設定されていない場合
 */
export declare function useAppParameters(): AppParameters;
