// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { ComponentType, createContext, useContext } from "react";

import { PanelStatics } from "@lichtblick/suite-base/components/Panel";
import { ExtensionNamespace } from "@lichtblick/suite-base/types/Extensions";
import { PanelConfig } from "@lichtblick/suite-base/types/panels";

export type PanelComponent = ComponentType<{ childId?: string; tabId?: string }> &
  PanelStatics<PanelConfig>;

export type PanelInfo = {
  title: string;
  type: string;
  description?: string;
  thumbnail?: string;
  help?: React.ReactNode;

  /** Set this to true if a panel has custom toolbar items and so cannot be renamed. */
  hasCustomToolbar?: boolean;

  /**
   * The panel module is a function to load the panel.
   * This is to support our lazy built-in panels
   */
  module: () => Promise<{ default: PanelComponent }>;
  config?: PanelConfig;
  extensionNamespace?: ExtensionNamespace;
};

/**
 * PanelCatalogContext - パネル一覧とパネル管理
 *
 * このコンテキストは、アプリケーションで利用可能なパネルの
 * 一覧を管理し、パネルのメタデータを提供します。
 *
 * 主な責任:
 * - 利用可能なパネルの一覧管理
 * - パネルのメタデータ提供
 * - パネルの検索・フィルタリング機能
 * - パネルの動的読み込み
 */
export interface PanelCatalog {
  /**
   * 利用可能なパネルの一覧
   *
   * 各PanelInfoには以下の情報が含まれます:
   * - type: パネルの一意識別子
   * - title: パネルの表示名
   * - description: パネルの説明
   * - thumbnail: パネルのサムネイル画像
   * - module: パネルのReactコンポーネント
   * - config: パネルの設定スキーマ
   */
  readonly panels: readonly PanelInfo[];

  /** Get panel information for a specific panel type (i.e. 3d, map, image, etc) */
  getPanelByType(type: string): PanelInfo | undefined;
}

/**
 * PanelCatalogContext - デフォルト値付きでコンテキストを作成
 *
 * デフォルト値:
 * - panels: 空配列（パネルなし）
 */
const PanelCatalogContext = createContext<PanelCatalog>({
  panels: [],

  getPanelByType(type: string): PanelInfo | undefined {
    return this.panels.find((panel) => panel.type === type);
  },
});

PanelCatalogContext.displayName = "PanelCatalogContext";

/**
 * usePanelCatalog - PanelCatalogContextの値を取得するカスタムフック
 *
 * @returns PanelCatalog - パネルカタログコンテキストの値
 *
 * 使用例:
 * ```typescript
 * const { panels } = usePanelCatalog();
 *
 * // 特定タイプのパネルを検索
 * const plotPanel = panels.find(panel => panel.type === "Plot");
 *
 * // カテゴリ別にパネルをフィルタリング
 * const visualizationPanels = panels.filter(panel =>
 *   panel.category === "visualization"
 * );
 * ```
 */
export function usePanelCatalog(): PanelCatalog {
  return useContext(PanelCatalogContext);
}

export default PanelCatalogContext;
