// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

/**
 * @fileoverview PanelErrorBoundary - パネル専用エラーバウンダリー
 *
 * このファイルは、個別のパネル内で発生したエラーをキャッチし、
 * アプリケーション全体のクラッシュを防ぐエラーバウンダリーを実装している。
 * パネル固有のエラー復旧機能とユーザーフレンドリーなエラー表示を提供。
 *
 * ## 主要機能
 *
 * ### 1. エラーキャッチ機能
 * - パネル内のJavaScriptエラーをキャッチ
 * - React Error Boundaryパターンの実装
 * - エラー発生時のコンポーネントツリーの分離
 * - アプリケーション全体への影響を最小限に抑制
 *
 * ### 2. エラーレポート機能
 * - エラー情報の自動収集と報告
 * - AppErrorによるエラーの構造化
 * - デバッグ情報の保持（スタックトレース、コンポーネント情報）
 * - 開発・運用時のエラー分析支援
 *
 * ### 3. ユーザーフレンドリーなエラー表示
 * - 技術的詳細を隠した分かりやすいエラーメッセージ
 * - エラー詳細の表示/非表示切り替え
 * - ソースコード位置情報の制御
 * - 統一されたエラー表示デザイン
 *
 * ### 4. パネル復旧機能
 * - **Dismiss**: エラーを無視して継続使用
 * - **Reset Panel**: パネル設定を初期値にリセット
 * - **Remove Panel**: パネルをレイアウトから削除
 * - 段階的な復旧オプションの提供
 *
 * ## エラーハンドリングフロー
 *
 * ```
 * 1. パネル内でエラー発生
 *    ↓
 * 2. componentDidCatch()でキャッチ
 *    ↓
 * 3. reportError()でエラー報告
 *    ↓
 * 4. エラー状態をstateに保存
 *    ↓
 * 5. ErrorDisplayコンポーネントで表示
 *    ↓
 * 6. ユーザーによる復旧アクション
 *    ↓
 * 7. 正常状態に復帰 or パネル削除
 * ```
 *
 * ## 復旧オプション
 *
 * ### Dismiss（無視）
 * - エラーを無視して継続使用
 * - 一時的なエラーの場合に有効
 * - パネル設定は保持される
 * - 最も軽量な復旧方法
 *
 * ### Reset Panel（リセット）
 * - パネル設定を初期値にリセット
 * - 設定起因のエラーを解決
 * - データは保持される
 * - 中程度の復旧方法
 *
 * ### Remove Panel（削除）
 * - パネルをレイアウトから完全削除
 * - 最も確実な復旧方法
 * - データとレイアウトが変更される
 * - 最後の手段として使用
 *
 * ## 使用例
 *
 * ```typescript
 * // パネル内でのエラーバウンダリー使用
 * <PanelErrorBoundary
 *   showErrorDetails={isDevelopment}
 *   hideErrorSourceLocations={!isDevelopment}
 *   onResetPanel={() => {
 *     // パネル設定をリセット
 *     resetPanelConfig(panelId);
 *   }}
 *   onRemovePanel={() => {
 *     // パネルをレイアウトから削除
 *     removePanelFromLayout(panelId);
 *   }}
 * >
 *   <MyPanelComponent />
 * </PanelErrorBoundary>
 * ```
 *
 * ## 技術的特徴
 *
 * - **React Error Boundary**: 標準的なエラーハンドリングパターン
 * - **Class Component**: componentDidCatchライフサイクルの活用
 * - **エラー報告**: reportError()による統一的なエラー処理
 * - **Material-UI統合**: 一貫したデザインシステム
 * - **アクセシビリティ**: 適切なARIA属性とキーボード操作
 *
 * @author Lichtblick Team
 * @since 2023
 */

import { Button, Link } from "@mui/material";
import { Component, ErrorInfo, PropsWithChildren, ReactNode } from "react";

import Stack from "@lichtblick/suite-base/components/Stack";
import { reportError } from "@lichtblick/suite-base/reportError";
import { AppError } from "@lichtblick/suite-base/util/errors";

import ErrorDisplay from "./ErrorDisplay";

/**
 * PanelErrorBoundaryコンポーネントのプロパティ型
 */
type Props = {
  /** エラーの技術的詳細を表示するかどうか（開発時のみ推奨） */
  showErrorDetails?: boolean;

  /** エラーのソースコード位置情報を隠すかどうか（本番環境推奨） */
  hideErrorSourceLocations?: boolean;

  /** パネルをリセットする際のコールバック関数 */
  onResetPanel: () => void;

  /** パネルを削除する際のコールバック関数 */
  onRemovePanel: () => void;
};

/**
 * PanelErrorBoundaryコンポーネントの状態型
 */
type State = {
  /** 現在のエラー情報（エラーがない場合はundefined） */
  currentError: { error: Error; errorInfo: ErrorInfo } | undefined;
};

/**
 * PanelErrorBoundaryコンポーネント
 *
 * 個別のパネル内で発生したエラーをキャッチし、アプリケーション全体の
 * クラッシュを防ぐエラーバウンダリー。パネル固有のエラー復旧機能を提供。
 *
 * ## 主要な責任
 *
 * ### 1. エラーキャッチ
 * - パネル内のJavaScriptエラーをキャッチ
 * - React Error Boundaryパターンの実装
 * - エラー発生時のコンポーネントツリーの分離
 *
 * ### 2. エラー報告
 * - エラー情報の自動収集と報告
 * - AppErrorによるエラーの構造化
 * - デバッグ情報の保持
 *
 * ### 3. ユーザーインターフェース
 * - 分かりやすいエラーメッセージ表示
 * - 復旧オプションの提供
 * - 段階的な復旧アクション
 *
 * ### 4. 状態管理
 * - エラー状態の追跡
 * - 復旧後の状態リセット
 * - エラー情報の保持
 *
 * ## エラーハンドリングの仕組み
 *
 * React Error Boundaryは以下の場合にエラーをキャッチする：
 * - レンダリング中のエラー
 * - ライフサイクルメソッド内のエラー
 * - コンストラクタ内のエラー
 *
 * ただし、以下の場合はキャッチしない：
 * - イベントハンドラ内のエラー
 * - 非同期コード内のエラー
 * - サーバーサイドレンダリング中のエラー
 * - Error Boundary自身のエラー
 *
 * ## 使用例
 *
 * ```typescript
 * // 基本的な使用
 * <PanelErrorBoundary
 *   onResetPanel={handleResetPanel}
 *   onRemovePanel={handleRemovePanel}
 * >
 *   <MyPanelComponent />
 * </PanelErrorBoundary>
 *
 * // 開発環境での詳細表示
 * <PanelErrorBoundary
 *   showErrorDetails={process.env.NODE_ENV === 'development'}
 *   hideErrorSourceLocations={process.env.NODE_ENV === 'production'}
 *   onResetPanel={handleResetPanel}
 *   onRemovePanel={handleRemovePanel}
 * >
 *   <MyPanelComponent />
 * </PanelErrorBoundary>
 * ```
 *
 * @author Lichtblick Team
 * @since 2023
 */
export default class PanelErrorBoundary extends Component<PropsWithChildren<Props>, State> {
  /**
   * コンポーネントの初期状態
   *
   * エラーが発生していない正常な状態で初期化される。
   */
  public override state: State = {
    currentError: undefined,
  };

  /**
   * エラーキャッチ時に呼び出されるライフサイクルメソッド
   *
   * パネル内でエラーが発生した際に自動的に呼び出される。
   * エラー情報を収集し、報告システムに送信した後、
   * コンポーネントの状態を更新してエラー表示に切り替える。
   *
   * ## 処理フロー
   *
   * 1. **エラー報告**: reportError()でエラー情報を送信
   * 2. **状態更新**: エラー情報をstateに保存
   * 3. **再レンダリング**: エラー表示UIに切り替え
   *
   * @param error - キャッチされたエラーオブジェクト
   * @param errorInfo - React固有のエラー情報（コンポーネントスタック等）
   */
  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // エラー情報を構造化してレポートシステムに送信
    reportError(new AppError(error, errorInfo));

    // エラー状態を更新してエラー表示に切り替え
    this.setState({ currentError: { error, errorInfo } });
  }

  /**
   * コンポーネントのレンダリング処理
   *
   * エラー状態に応じて、通常のコンテンツまたはエラー表示を
   * 切り替える。エラー発生時は、ユーザーフレンドリーな
   * エラー表示と復旧オプションを提供する。
   *
   * ## レンダリング分岐
   *
   * ### エラー状態の場合
   * - ErrorDisplayコンポーネントによるエラー表示
   * - 分かりやすいエラーメッセージ
   * - 3つの復旧オプション（Dismiss、Reset、Remove）
   * - エラー詳細の表示/非表示制御
   *
   * ### 正常状態の場合
   * - 子コンポーネントをそのまま表示
   * - 通常のパネル機能を提供
   *
   * @returns レンダリングされるReactノード
   */
  public override render(): ReactNode {
    // エラー状態の場合、エラー表示UIを表示
    if (this.state.currentError) {
      return (
        <ErrorDisplay
          title="This panel encountered an unexpected error"
          error={this.state.currentError.error}
          errorInfo={this.state.currentError.errorInfo}
          showErrorDetails={this.props.showErrorDetails}
          hideErrorSourceLocations={this.props.hideErrorSourceLocations}
          content={
            <p>
              Something went wrong in this panel.{" "}
              <Link
                color="inherit"
                onClick={() => {
                  // エラーを無視して継続使用
                  this.setState({ currentError: undefined });
                }}
              >
                Dismiss this error
              </Link>{" "}
              to continue using this panel. If the issue persists, try resetting the panel.
            </p>
          }
          actions={
            <>
              <Stack direction="row-reverse" gap={1}>
                {/* Dismissボタン: エラーを無視して継続 */}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    this.setState({ currentError: undefined });
                  }}
                >
                  Dismiss
                </Button>

                {/* Reset Panelボタン: パネル設定をリセット */}
                <Button
                  variant="outlined"
                  title="Reset panel settings to default values"
                  color="error"
                  onClick={() => {
                    // エラー状態をクリアしてパネルをリセット
                    this.setState({ currentError: undefined });
                    this.props.onResetPanel();
                  }}
                >
                  Reset Panel
                </Button>

                {/* Remove Panelボタン: パネルを削除 */}
                <Button
                  variant="text"
                  title="Remove this panel from the layout"
                  color="error"
                  onClick={this.props.onRemovePanel}
                >
                  Remove Panel
                </Button>
              </Stack>
            </>
          }
        />
      );
    }

    // 正常状態の場合、子コンポーネントをそのまま表示
    return this.props.children;
  }
}
