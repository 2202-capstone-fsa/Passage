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
var ending = /** @class */ (function (_super) {
    __extends(ending, _super);
    function ending() {
        return _super.call(this, "ending") || this;
    }
    ending.prototype.preload = function () {
        //Load keyboard for player to use.
        this.cursors = this.input.keyboard.createCursorKeys();
    };
    ending.prototype.create = function () {
        var _this = this;
        window.scrollTo(1500, 1500);
        this.cameras.main.centerOn(280.5, 150.5);
        var inventory = localStorage;
        var heart = inventory.Heart;
        var Skull = inventory.Skull;
        var soul = inventory.Soul;
        var text = "Place holder text";
        this.message = this.add
            .text(0, 0, "You leave the town.", {
            color: "white",
            backgroundColor: "black",
            fontSize: "18px",
            align: "center",
            baselineX: 0,
            baselineY: 0,
            wordWrap: { width: 500 },
        })
            .setWordWrapWidth(500);
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
        if (heart && soul && Skull) {
            text =
                "The heart, the soul, the Skull. The body is not complete without the soul, and the soul without the body. Having recovered all 3 pieces you feel a strong force moving you forward. The world of the living begins to fade away, and you move towards your next step in your passage.";
        }
        else if (heart || soul || Skull) {
            text =
                "With only part of your being in your possession, you feel incomplete. You feel a heavy, overbearing weight draw you back towards the uninhabited town. Perhaps there is something unfinished? Your body, mind and soul, stuck in a strange disconnect between this world and the next, fractures and sheers. Then you awaken, wondering it it was all a dream..";
        }
        else {
            text =
                "Locations are left unexplored and their purposes remain undiscovered. You travel deeper into the darkness. Your body weakens and your limbs loosen. Bit by bit you are torn apart and dissolved into the ether. At the last moment of conciousness, a pinhole of light appears and you reach for it. You reawaken wondering if it was all a dream..";
        }
        var endTexts = text.match(/[^\.!\?]+[\.!\?]+/g);
        var counter = -1;
        // Hit spacebar to interact with objects.
        this.cursors.space.on("down", function () {
            _this.message.text = "";
            counter++;
            endTexts[counter]
                ? _this.typewriteText(endTexts[counter])
                : _this.scene.start("game");
        });
    };
    ending.prototype.update = function (t, dt) {
        if (!this.cursors || !this.player) {
            return;
        }
    };
    return ending;
}(phaser_1.default.Scene));
exports.default = ending;
//# sourceMappingURL=ending.js.map