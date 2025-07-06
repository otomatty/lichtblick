// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

/**
 * @fileoverview PanelContext - パネルコンテキストの型定義とProvider
 *
 * このファイルは、Lichtblickアプリケーションのパネルシステムにおける
 * コンテキストの型定義とReact Contextの実装を提供している。
 * 各パネルが自身の状態や操作にアクセスするための中核的な仕組み。
 *
 * ## 主要機能
 *
 * ### 1. パネル識別情報
 * - パネルタイプ、ID、タイトルの管理
 * - タブIDによる複数タブ対応
 * - 一意性を保証した識別システム
 *
 * ### 2. 設定管理
 * - パネル固有の設定データの管理
 * - 設定保存・更新機能
 * - 型安全な設定アクセス
 *
 * ### 3. パネル操作
 * - 隣接パネルの開設
 * - パネルの置換・削除
 * - 複数パネルの一括設定更新
 *
 * ### 4. フルスクリーン制御
 * - フルスクリーン状態の管理
 * - 親子関係の状態追跡
 * - z-index調整による適切な表示制御
 *
 * ### 5. インタラクション対応
 * - ツールバーのドラッグハンドル連携
 * - メッセージパスのドロップ設定
 * - 外部システムとの統合
 *
 * ## 使用例
 *
 * ```typescript
 * // パネル内でのコンテキスト使用
 * function MyPanel() {
 *   const {
 *     config,
 *     saveConfig,
 *     enterFullscreen,
 *     openSiblingPanel
 *   } = usePanelContext();
 *
 *   const handleSettingsChange = (newSettings: MyPanelConfig) => {
 *     saveConfig({ ...config, ...newSettings });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={enterFullscreen}>フルスクリーン</button>
 *       <button onClick={() => openSiblingPanel({ type: "3d" })}>
 *         3Dパネルを開く
 *       </button>
 *     </div>
 *   );
 * }
 *
 * // パネルプロバイダーでの使用
 * <PanelContext.Provider value={panelContextValue}>
 *   <MyPanelComponent />
 * </PanelContext.Provider>
 * ```
 *
 * ## 技術的特徴
 *
 * - **型安全性**: TypeScriptによる厳密な型定義
 * - **React Context**: 効率的な状態共有
 * - **ジェネリクス**: パネル固有の設定型対応
 * - **エラーハンドリング**: 適切なコンテキスト使用の強制
 * - **拡張性**: 新しいパネル操作の追加が容易
 *
 * @author Lichtblick Team
 * @since 2023
 */

import { MessagePathDropConfig } from "@lichtblick/suite-base/components/PanelExtensionAdapter";
import { SaveConfig, PanelConfig, OpenSiblingPanel } from "@lichtblick/suite-base/types/panels";

/**
 * パネルコンテキストの型定義
 *
 * 各パネルがアクセス可能な状態と操作を定義する中核的な型。
 * ジェネリクス型Tによって、パネル固有の設定型を指定可能。
 *
 * @template T - パネル固有の設定オブジェクトの型
 */
export type PanelContextType<T> = {
  /** パネルのタイプ識別子（例: "3d", "plot", "image"） */
  type: string;

  /** パネルの一意識別子（UUID形式） */
  id: string;

  /** パネルの表示タイトル */
  title: string;

  /** 所属するタブのID（マルチタブ対応） */
  tabId?: string;

  /** パネルの現在の設定データ */
  config: PanelConfig;

  /**
   * パネル設定を保存する関数
   *
   * パネル固有の設定を永続化し、アプリケーション全体で
   * 設定の一貫性を保つ。設定変更は即座に反映される。
   *
   * @param config - 保存する設定データ
   */
  saveConfig: SaveConfig<T>;

  /**
   * 指定されたパネルタイプの全インスタンスの設定を更新
   *
   * 同じタイプのパネルが複数存在する場合、
   * 全てのインスタンスに同じ設定変更を適用する。
   *
   * @param panelType - 更新対象のパネルタイプ
   * @param updateConfig - 設定を更新する関数
   */
  updatePanelConfigs: (panelType: string, updateConfig: (config: T) => T) => void;

  /**
   * 隣接位置に新しいパネルを開く
   *
   * 現在のパネルの隣（右側または下側）に新しいパネルを
   * 開設する。レイアウトは自動的に調整される。
   */
  openSiblingPanel: OpenSiblingPanel;

  /**
   * 現在のパネルを別のパネルタイプに置換
   *
   * パネルの位置とサイズを保持したまま、
   * 異なるタイプのパネルに切り替える。
   *
   * @param panelType - 新しいパネルタイプ
   * @param config - 新しいパネルの初期設定
   */
  replacePanel: (panelType: string, config: Record<string, unknown>) => void;

  /**
   * パネルをフルスクリーン表示にする
   *
   * 現在のパネルを画面全体に拡大表示する。
   * 他のパネルやUIコンポーネントは一時的に非表示になる。
   */
  enterFullscreen: () => void;

  /**
   * フルスクリーン表示を終了する
   *
   * パネルを元のサイズと位置に戻し、
   * 通常のレイアウトに復帰する。
   */
  exitFullscreen: () => void;

  /** 現在のパネルがフルスクリーン状態かどうか */
  isFullscreen: boolean;

  /**
   * 子要素のフルスクリーン状態を親パネルに通知
   *
   * 子パネルがフルスクリーン状態になった時に、
   * 親パネルのz-index設定を調整するために使用される。
   * これにより、適切な重ね順が維持される。
   *
   * @param hasFullscreenDescendant - 子要素がフルスクリーン状態かどうか
   */
  // eslint-disable-next-line @lichtblick/no-boolean-parameters
  setHasFullscreenDescendant: (hasFullscreenDescendant: boolean) => void;

  /**
   * ツールバーのドラッグハンドルを接続
   *
   * パネルのドラッグ&ドロップ操作を有効にするために、
   * ツールバー要素をドラッグハンドルとして登録する。
   *
   * @param el - ドラッグハンドルとして使用するDOM要素
   */
  connectToolbarDragHandle?: (el: Element | ReactNull) => void;

  /**
   * メッセージパスのドロップ設定を更新
   *
   * パネルがメッセージパスのドロップを受け入れるかどうかと、
   * ドロップ時の動作を設定する。データ可視化パネルで使用。
   *
   * @param config - ドロップ設定、またはundefinedで無効化
   */
  setMessagePathDropConfig: (config: MessagePathDropConfig | undefined) => void;
};

/**
 * パネルコンテキストのReact Context
 *
 * コンポーネントツリー内でパネルの状態と操作を共有するための
 * React Context。各パネルはこのContextを通じて自身の
 * 情報と操作にアクセスする。
 *
 * ## 使用方法
 *
 * ### Provider側（Panel HOC内）
 * ```typescript
 * const contextValue: PanelContextType<MyPanelConfig> = {
 *   type: "my-panel",
 *   id: panelId,
 *   title: "My Panel",
 *   config: panelConfig,
 *   saveConfig: handleSaveConfig,
 *   // ... その他の操作
 * };
 *
 * <PanelContext.Provider value={contextValue}>
 *   <MyPanelComponent />
 * </PanelContext.Provider>
 * ```
 *
 * ### Consumer側（パネル内コンポーネント）
 * ```typescript
 * function MyPanelComponent() {
 *   const context = useContext(PanelContext);
 *   // または
 *   const context = usePanelContext(); // エラーハンドリング付き
 * }
 * ```
 */
// Context used for components to know which panel they are inside
const PanelContext = React.createContext<PanelContextType<PanelConfig> | undefined>(undefined);
PanelContext.displayName = "PanelContext";

/**
 * パネルコンテキストを安全に取得するカスタムフック
 *
 * usePanelContext()は、現在のコンポーネントがパネル内にあることを
 * 保証し、適切なコンテキストを返す。コンテキストが存在しない場合は
 * エラーを投げるため、型安全性が保たれる。
 *
 * ## 使用例
 *
 * ```typescript
 * function MyPanelComponent() {
 *   const {
 *     config,
 *     saveConfig,
 *     enterFullscreen,
 *     openSiblingPanel
 *   } = usePanelContext();
 *
 *   const handleFullscreen = () => {
 *     enterFullscreen();
 *   };
 *
 *   const handleOpenSibling = () => {
 *     openSiblingPanel({ type: "plot" });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleFullscreen}>フルスクリーン</button>
 *       <button onClick={handleOpenSibling}>プロットを開く</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * ## エラーハンドリング
 *
 * このフックは、パネルコンテキスト外で使用された場合に
 * 明確なエラーメッセージを提供する。これにより、
 * 開発時の問題を早期に発見できる。
 *
 * @returns パネルコンテキストオブジェクト
 * @throws {Error} パネルコンテキスト外で使用された場合
 */
export function usePanelContext(): PanelContextType<PanelConfig> {
  const context = React.useContext(PanelContext);
  if (!context) {
    throw new Error("Tried to use PanelContext outside a <PanelContext.Provider />");
  }
  return context;
}

export default PanelContext;
