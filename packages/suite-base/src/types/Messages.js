// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0
/**
 * 画像マーカーの種類
 *
 * @description 画像上に描画可能なマーカーの種類を定義。
 * 2D画像での注釈や解析結果の表示に使用。
 */
export var ImageMarkerType;
(function (ImageMarkerType) {
    /** 円形マーカー */
    ImageMarkerType[ImageMarkerType["CIRCLE"] = 0] = "CIRCLE";
    /** 連続線分マーカー */
    ImageMarkerType[ImageMarkerType["LINE_STRIP"] = 1] = "LINE_STRIP";
    /** 独立線分マーカー */
    ImageMarkerType[ImageMarkerType["LINE_LIST"] = 2] = "LINE_LIST";
    /** 多角形マーカー */
    ImageMarkerType[ImageMarkerType["POLYGON"] = 3] = "POLYGON";
    /** 点マーカー */
    ImageMarkerType[ImageMarkerType["POINTS"] = 4] = "POINTS";
    /** テキストマーカー (標準仕様の拡張) */
    ImageMarkerType[ImageMarkerType["TEXT"] = 5] = "TEXT";
})(ImageMarkerType || (ImageMarkerType = {}));
/**
 * 画像マーカーのアクション
 *
 * @description 画像マーカーに対して実行するアクション。
 */
export var ImageMarkerAction;
(function (ImageMarkerAction) {
    /** マーカーを追加 */
    ImageMarkerAction[ImageMarkerAction["ADD"] = 0] = "ADD";
    /** マーカーを削除 */
    ImageMarkerAction[ImageMarkerAction["REMOVE"] = 1] = "REMOVE";
})(ImageMarkerAction || (ImageMarkerAction = {}));
