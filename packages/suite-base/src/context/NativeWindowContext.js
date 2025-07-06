// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext } from "react";
/**
 * ## NativeWindowContext
 *
 * **ネイティブウィンドウ制御のContext**
 *
 * ### 概要
 * - デスクトップアプリケーションのウィンドウ制御機能を提供
 * - Electronアプリでのウィンドウ操作を抽象化
 * - プラットフォーム固有のウィンドウ機能を統合
 *
 * ### 主な機能
 * - **ファイル関連付け**: ウィンドウとファイルの関連付け表示
 * - **フルスクリーン制御**: フルスクリーンモードの監視
 * - **ウィンドウイベント**: ウィンドウ状態変更の通知
 * - **プラットフォーム抽象化**: Web版では undefined、Desktop版で実装
 *
 * ### 使用例
 * ```typescript
 * import { useContext, useEffect } from "react";
 * import NativeWindowContext from "./NativeWindowContext";
 *
 * function WindowManager() {
 *   const nativeWindow = useContext(NativeWindowContext);
 *   const [isFullscreen, setIsFullscreen] = useState(false);
 *   const [currentFile, setCurrentFile] = useState<string | undefined>();
 *
 *   useEffect(() => {
 *     if (!nativeWindow) {
 *       // Web版では何もしない
 *       return;
 *     }
 *
 *     // フルスクリーンイベントの監視
 *     nativeWindow.on("enter-full-screen", () => {
 *       setIsFullscreen(true);
 *       // フルスクリーン用のUIレイアウトに変更
 *       document.body.classList.add("fullscreen-mode");
 *     });
 *
 *     nativeWindow.on("leave-full-screen", () => {
 *       setIsFullscreen(false);
 *       // 通常のUIレイアウトに戻す
 *       document.body.classList.remove("fullscreen-mode");
 *     });
 *   }, [nativeWindow]);
 *
 *   // ファイル関連付けの更新
 *   useEffect(() => {
 *     if (nativeWindow && currentFile) {
 *       nativeWindow.setRepresentedFilename(currentFile);
 *     }
 *   }, [nativeWindow, currentFile]);
 *
 *   return (
 *     <div className={isFullscreen ? "fullscreen" : "windowed"}>
 *     </div>
 *   );
 * }
 * ```
 *
 * ### 設計パターン
 * - **Observer パターン**: ウィンドウイベントの監視と通知
 * - **Platform Abstraction**: プラットフォーム固有機能の抽象化
 * - **Context API**: グローバルな状態管理
 * - **Async/Await**: 非同期ウィンドウ操作
 *
 * ### プラットフォーム対応
 * - **Desktop (Electron)**: 完全実装
 *   - macOS: Represented File 機能サポート
 *   - Windows: 基本的なウィンドウ制御
 *   - Linux: 基本的なウィンドウ制御
 * - **Web**: undefined (ネイティブウィンドウなし)
 * - **Mobile**: undefined (ネイティブウィンドウなし)
 *
 * ### パフォーマンス考慮事項
 * - ウィンドウイベントは頻繁に発生する可能性があるため、ハンドラーは軽量に
 * - ファイル関連付けの更新は必要な時のみ実行
 * - メモリリークを防ぐための適切なクリーンアップ
 *
 * ### セキュリティ考慮事項
 * - ファイルパスの検証は呼び出し元で実施
 * - ウィンドウイベントは信頼できるソースからのみ発生
 * - 外部からの不正なウィンドウ操作を防止
 *
 * @see SharedRootContext - ルートコンテキストでの統合
 * @see INativeWindow - インターフェース定義
 */
const NativeWindowContext = createContext(undefined);
NativeWindowContext.displayName = "NativeWindowContext";
export default NativeWindowContext;
