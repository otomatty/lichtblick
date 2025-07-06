// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
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
const PanelContext = React.createContext(undefined);
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
export function usePanelContext() {
    const context = React.useContext(PanelContext);
    if (!context) {
        throw new Error("Tried to use PanelContext outside a <PanelContext.Provider />");
    }
    return context;
}
export default PanelContext;
