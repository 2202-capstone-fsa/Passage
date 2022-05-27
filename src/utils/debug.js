"use strict";
exports.__esModule = true;
exports.debugDraw = void 0;
var phaser_1 = require("phaser");
var debugDraw = function (layer, scene) {
    var debugGraphics = scene.add.graphics().setAlpha(0.7);
    layer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new phaser_1["default"].Display.Color(234, 234, 48, 24),
        faceColor: new phaser_1["default"].Display.Color(40, 39, 37, 255)
    });
};
exports.debugDraw = debugDraw;
