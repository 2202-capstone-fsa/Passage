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
var start = /** @class */ (function (_super) {
    __extends(start, _super);
    function start() {
        return _super.call(this, "start") || this;
    }
    start.prototype.preload = function () {
        //Load keyboard for player to use.
        this.cursors = this.input.keyboard.createCursorKeys();
    };
    start.prototype.create = function () {
        //this.cameras.main.centerOn(1000, 1000);
        var _this = this;
        var text = "How long do I have to wait? I wish he would come home. Just walk in through that door. It feels like it's been forever. I've got dinner waiting... ... >You awaken in a dim room. >It's daytime. Oh man, what a splitting \n headache... Why do I not remember \n a thing? Where am I... Did I take a tumble? Maybe if I move around \n I can get my bearings. Up I go.";
        this.message = this.add
            .text(200, 200, "You hear a voice. \n \n (Press SPACE to continue)", {
            color: "lightblue",
            fontFamily: "Helvetica",
            backgroundColor: "black",
            fontSize: "20px",
            align: "center",
            baselineX: 0,
            baselineY: 0,
            wordWrap: { width: 400 },
        })
            .setWordWrapWidth(400);
        this.typewriteText = function (text) {
            var _this = this;
            var lines = this.message.getWrappedText(text);
            var wrappedText = lines.join("\n");
            var length = wrappedText.length;
            var i = 0;
            this.time.addEvent({
                callback: function () {
                    _this.message.text += wrappedText[i];
                    ++i;
                },
                repeat: length - 1,
                delay: 10,
            });
        };
        //split into array of sentences
        var endTexts = text.match(/[^\.!\?]+[\.!\?]+/g);
        var counter = -1;
        var startHome = function () {
            window.scrollTo(130, 110);
            _this.scene.start("home");
        };
        // Hit spacebar to interact with objects.
        this.cursors.space.on("down", function () {
            _this.message.text = "";
            counter++;
            endTexts[counter] ? _this.typewriteText(endTexts[counter]) : startHome();
        });
    };
    start.prototype.update = function (t, dt) {
        if (!this.cursors || !this.player) {
            return;
        }
    };
    return start;
}(phaser_1.default.Scene));
exports.default = start;
//# sourceMappingURL=start.js.map