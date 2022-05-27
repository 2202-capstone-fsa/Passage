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
var helper_1 = require("../../utils/helper");
var atlantis_json_1 = __importDefault(require("../../../public/tiles/atlantis.json"));
var dialogue = [
    {
        x: 250,
        y: 400,
        properties: [
            {
                name: "message",
                value: "A secret cave! You're always supposed to go behind the waterfall! Haha! I.. wish someone was here to share this moment with me. What can I do here, anyway?",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "I could always go for a little treasure hunt. One dubloon in my pocket, and I'll be the richest man in the world! Normal man, at least.",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "Her voice again: \"This pearl necklace is all I have of him. As long as I have this, his spirit will always be with me.\"",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "Oh boy a shovel!\"",
            },
        ],
        hasAppeared: false,
    },
];
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        return _super.call(this, "atlantis") || this;
    }
    Game.prototype.preload = function () {
        //Load graphics for atlantis map.
        this.load.image("icons", "tiles/icons/icons.png");
        this.load.image("cave", "tiles/cave/atlantis.png");
        this.load.tilemapTiledJSON("atlantis", "tiles/atlantis.json");
        //Load keyboard for player to use.
        this.cursors = this.input.keyboard.createCursorKeys();
    };
    Game.prototype.create = function () {
        var _this = this;
        this.cameras.main.setSize(575.5, 550.5);
        //Create tile sets so that we can access Tiled data later on.
        var map = this.make.tilemap({ key: "atlantis" });
        var buildingTileSet = map.addTilesetImage("Atlantis", "cave");
        var iconsTileSet = map.addTilesetImage("Icons", "icons");
        var atlantisTilesets = [buildingTileSet, iconsTileSet];
        //Create ground layer first using tile set data.
        var groundLayer = map.createLayer("Ground", atlantisTilesets);
        var wallLayer = map.createLayer("Walls", atlantisTilesets);
        var objLayer = map.createLayer("Objects", atlantisTilesets);
        //Remove token from the overworld and spawn player.
        localStorage.removeItem("from");
        this.player = this.physics.add.sprite(238, 400, "player", "shady_back_1");
        (0, helper_1.setPlayer)(this.player);
        (0, helper_1.createAnims)(this.anims);
        //Collides.
        wallLayer.setCollisionByProperty({ collides: true });
        objLayer.setCollisionByProperty({ collides: true });
        groundLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, groundLayer);
        this.physics.add.collider(this.player, wallLayer);
        this.physics.add.collider(this.player, objLayer);
        //Initialize message for this scene.
        this.message = this.add.text(800, 750, "", {
            color: "#FFF5EE",
            fontFamily: "Tahoma",
            backgroundColor: "#708090",
            fontSize: "17px",
            align: "center",
            baselineX: 0,
            baselineY: 0,
            wordWrap: { width: 350 },
        });
        //Create sounds.
        var item = this.sound.add("item");
        this.waterfall = this.sound.add("waterfall");
        var musicConfig = {
            mute: false,
            volume: 0.1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0,
        };
        this.waterfall.play(musicConfig);
        // Hit spacebar to interact with objects.
        this.cursors.space.on("down", function () {
            (0, helper_1.interact)(0.03, _this.message, _this.player, atlantis_json_1.default.layers[3].objects, item);
        });
        // Hit shift to view Inventory.
        this.cursors.shift.on("down", function () {
            return (0, helper_1.displayInventory)(_this.message, _this.player);
        }),
            this.cameras.main.startFollow(this.player);
    };
    Game.prototype.update = function (t, dt) {
        this.exits();
        this.playDialogue();
        this.grabItems();
        this.cameras.main.scrollX = this.player.x - 400;
        this.cameras.main.scrollY = this.player.y - 300;
        var speed = this.message.text ? 0 : 120;
        (0, helper_1.movePlayer)(this.player, speed, this.cursors);
    };
    Game.prototype.exits = function () {
        if (this.player.y > 428) {
            localStorage.setItem("from", "atlantis");
            this.waterfall.stop();
            this.scene.stop("atlantis");
            this.scene.start("game");
        }
    };
    Game.prototype.playDialogue = function () {
        var midwayPoint = dialogue[1];
        var grabSoul = dialogue[2];
        var grabShovel = dialogue[3];
        //Where is the shovel?
        (0, helper_1.dialogueArea)(192, 287, 9, 59, grabSoul, this.player, this.message);
        (0, helper_1.dialogueArea)(96, 142, 302, 337, grabShovel, this.player, this.message);
        if (this.player.y < 176 && !midwayPoint.hasAppeared) {
            if (this.message.text)
                this.message.text = "";
            (0, helper_1.updateText)(this.player, midwayPoint, this.message);
            midwayPoint.hasAppeared = true;
        }
        var dialogueSpot = (0, helper_1.isItClose)(0.03, this.player, dialogue);
        if (dialogueSpot && !dialogueSpot.hasAppeared) {
            if (this.message.text)
                this.message.text = "";
            (0, helper_1.updateText)(this.player, dialogueSpot, this.message);
            dialogueSpot.hasAppeared = true;
        }
    };
    Game.prototype.grabItems = function () {
        if (this.player.x > 192 &&
            this.player.x < 287 &&
            this.player.y < 50 &&
            !localStorage["Soul"]) {
            this.sound.play("item");
            localStorage.setItem("Soul", "Apparently this is my soul.");
        }
        if (this.player.x > 96 &&
            this.player.x < 142 &&
            this.player.y > 302 &&
            !localStorage["Shovel"]) {
            this.sound.play("item");
            localStorage.setItem("Shovel", "Memories of the beach.");
        }
    };
    return Game;
}(phaser_1.default.Scene));
exports.default = Game;
//# sourceMappingURL=Atlantis.js.map