// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext } from "react";
/**
 * ## NativeAppMenuContext
 *
 * **ネイティブアプリメニュー管理のContext**
 *
 * ### 概要
 * - デスクトップアプリケーションのメニューバーとの連携を提供
 * - Electronアプリでのメニュー操作を抽象化
 * - プラットフォーム固有のメニュー機能を統合
 *
 * ### 主な機能
 * - **メニューイベント監視**: メニュー項目の選択を検出
 * - **イベント駆動**: Observer パターンによる疎結合な実装
 * - **プラットフォーム抽象化**: Web版では undefined、Desktop版で実装
 *
 * ### 使用例
 * ```typescript
 * import { useContext } from "react";
 * import NativeAppMenuContext from "./NativeAppMenuContext";
 *
 * function MenuHandler() {
 *   const nativeAppMenu = useContext(NativeAppMenuContext);
 *
 *   useEffect(() => {
 *     if (!nativeAppMenu) {
 *       // Web版では何もしない
 *       return;
 *     }
 *
 *     // メニューイベントの監視
 *     const unregisterFile = nativeAppMenu.on("open-file", handleOpenFile);
 *     const unregisterConnection = nativeAppMenu.on("open-connection", handleOpenConnection);
 *     const unregisterDemo = nativeAppMenu.on("open-demo", handleOpenDemo);
 *
 *     return () => {
 *       unregisterFile?.();
 *       unregisterConnection?.();
 *       unregisterDemo?.();
 *     };
 *   }, [nativeAppMenu]);
 *
 *   return null;
 * }
 * ```
 *
 * ### 設計パターン
 * - **Observer パターン**: イベント監視と通知
 * - **Platform Abstraction**: プラットフォーム固有機能の抽象化
 * - **Context API**: グローバルな状態管理
 *
 * ### プラットフォーム対応
 * - **Desktop (Electron)**: 完全実装
 * - **Web**: undefined (メニューバーなし)
 * - **Mobile**: undefined (メニューバーなし)
 *
 * ### セキュリティ考慮事項
 * - メニューイベントは信頼できるソースからのみ発生
 * - ハンドラーの登録/解除は適切に管理
 * - メモリリークを防ぐための適切なクリーンアップ
 *
 * @see SharedRootContext - ルートコンテキストでの統合
 * @see INativeAppMenu - インターフェース定義
 */
const NativeAppMenuContext = createContext(undefined);
NativeAppMenuContext.displayName = "NativeAppMenuContext";
export default NativeAppMenuContext;
