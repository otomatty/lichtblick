// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { createContext, useContext } from "react";
/**
 * PanelCatalogContext - デフォルト値付きでコンテキストを作成
 *
 * デフォルト値:
 * - panels: 空配列（パネルなし）
 */
const PanelCatalogContext = createContext({
    panels: [],
    getPanelByType(type) {
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
export function usePanelCatalog() {
    return useContext(PanelCatalogContext);
}
export default PanelCatalogContext;
