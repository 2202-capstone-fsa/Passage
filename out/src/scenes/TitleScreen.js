"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var phaser_1 = __importDefault(require("phaser"));
var TitleScreen = /** @class */ (function (_super) {
    __extends(TitleScreen, _super);
    function TitleScreen() {
        return _super.call(this, "titlescreen") || this;
    }
    TitleScreen.prototype.preload = function () {
        //Load graphics of background
        this.load.image("atlantis", "tiles/cave/atlantis.png");
        this.load.tilemapTiledJSON("titlescreen", "tiles/titlescreen.json");
        //Load title
        this.load.image("title", "tiles/title.png");
    };
    TitleScreen.prototype.create = function () {
        var _this = this;
        var map = this.make.tilemap({ key: "titlescreen" });
        this.cameras.main.zoom = 1;
        this.cameras.main.setPosition(50, 0);
        window.scrollTo(0, 150);
        var titleTileSet = map.addTilesetImage("Atlantis", "atlantis");
        //Create Layer
        var titleBackLayer = map.createLayer("Background", titleTileSet);
        var titleFrontLayer = map.createLayer("Foreground", titleTileSet);
        titleBackLayer;
        titleFrontLayer;
        //Create the title png
        var items = this.physics.add.staticGroup();
        items.create(240, 200, "title");
        var music = this.sound.add("music");
        var musicConfig = {
            mute: false,
            volume: 0.4,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0,
        };
        music.play(musicConfig);
        this.add.text(240, 300, "Press Shift to Start", {}).setOrigin(0.5);
        this.input.keyboard.once("keydown-SHIFT", function () {
            window.scrollTo(75, 150);
            _this.scene.start("start");
        });
    };
    TitleScreen.prototype.update = function () { };
    return TitleScreen;
}(phaser_1.default.Scene));
exports.default = TitleScreen;
//# sourceMappingURL=TitleScreen.js.map