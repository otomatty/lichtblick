// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { enqueueSnackbar } from "notistack";
import path from "path";
import { useCallback, useMemo } from "react";
import { usePlayerSelection, } from "@lichtblick/suite-base/context/PlayerSelectionContext";
import { FILE_ACCEPT_TYPE } from "@lichtblick/suite-base/context/Workspace/constants";
import showOpenFilePicker from "@lichtblick/suite-base/util/showOpenFilePicker";
/**
 * ファイルオープン機能を提供するカスタムフック
 *
 * ユーザーがファイルを選択してデータソースとして開くための
 * 統合されたファイルオープン機能を提供します。
 *
 * 主な機能:
 * - ファイルピッカーダイアログの表示
 * - 複数ファイルの選択サポート
 * - ファイル拡張子の検証
 * - 適切なデータソースファクトリーの選択
 * - エラーハンドリングとユーザー通知
 *
 * 制限事項:
 * - 現在、複数ファイルはMCAP形式のみサポート
 * - 異なる拡張子のファイルを同時に選択することはできない
 *
 * @param sources 利用可能なデータソースファクトリーのリスト
 * @returns ファイルオープン処理を実行する非同期関数
 *
 * 使用例:
 * ```typescript
 * function FileMenu() {
 *   const { availableSources } = usePlayerSelection();
 *   const openFile = useOpenFile(availableSources);
 *
 *   const handleOpenFile = async () => {
 *     try {
 *       await openFile();
 *     } catch (error) {
 *       // エラーは内部でスナックバーに表示される
 *       console.error('ファイルオープンエラー:', error);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleOpenFile}>
 *       ファイルを開く
 *     </button>
 *   );
 * }
 * ```
 *
 * エラーケース:
 * - 異なる拡張子のファイルを同時選択
 * - サポートされていない拡張子
 * - 複数のファクトリーが同じ拡張子をサポート
 * - MCAP以外で複数ファイルを選択
 */
export function useOpenFile(sources) {
    const { selectSource } = usePlayerSelection();
    /**
     * エラーメッセージを表示してエラーを投げる内部関数
     *
     * @param message エラーメッセージ
     * @throws 指定されたメッセージのError
     */
    const throwErrorAndSnackbar = (message) => {
        enqueueSnackbar(message, { variant: "error" });
        throw new Error(message);
    };
    /**
     * サポートされているファイル拡張子のリストを計算
     *
     * 全てのデータソースファクトリーがサポートする
     * ファイル拡張子を統合したリストを生成
     */
    const allExtensions = useMemo(() => {
        return sources.reduce((all, source) => {
            if (!source.supportedFileTypes) {
                return all;
            }
            return [...all, ...source.supportedFileTypes];
        }, []);
    }, [sources]);
    return useCallback(async () => {
        // ファイルピッカーダイアログを表示
        const filesHandle = await showOpenFilePicker({
            multiple: true,
            types: [
                {
                    description: allExtensions.join(", "),
                    accept: { [FILE_ACCEPT_TYPE]: allExtensions },
                },
            ],
        });
        // ファイルが選択されなかった場合は何もしない
        if (filesHandle.length === 0) {
            return;
        }
        // 選択されたファイルの情報を処理
        const processedFiles = await Promise.all(filesHandle.map(async (handle) => {
            const file = await handle.getFile();
            return {
                file,
                extension: path.extname(file.name),
            };
        }));
        // 拡張子の統一性をチェック
        const uniqueExtensions = new Set(processedFiles.map(({ extension }) => extension));
        if (uniqueExtensions.size > 1) {
            throwErrorAndSnackbar(`Multiple file extensions detected: ${[...uniqueExtensions].join(", ")}. All files must have the same extension.`);
        }
        const [extension] = uniqueExtensions;
        // 対応するデータソースファクトリーを検索
        const matchingSources = sources.filter((source) => (source.supportedFileTypes &&
            source.type === "file" &&
            source.supportedFileTypes.includes(extension)) ??
            false);
        // 対応するファクトリーが見つからない場合
        if (matchingSources.length === 0) {
            throwErrorAndSnackbar(`Cannot find a source to handle files with extension ${extension}`);
        }
        // 複数のファクトリーが同じ拡張子をサポートしている場合
        if (matchingSources.length > 1) {
            throwErrorAndSnackbar(`The file extension "${extension}" is not supported. Please select files with the following extensions: ${allExtensions.join(", ")}.`);
        }
        /**
         * Should be removed when implement the rest of extensions.
         */
        if (extension !== ".mcap" && processedFiles.length > 1) {
            throwErrorAndSnackbar(`The application only support multiple files for MCAP extension.`);
        }
        // 選択されたファイルでデータソースを選択
        selectSource(matchingSources[0].id, {
            type: "file",
            handles: filesHandle,
        });
    }, [allExtensions, selectSource, sources]);
}
