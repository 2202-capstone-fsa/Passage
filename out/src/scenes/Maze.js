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
var helper_1 = require("../utils/helper");
var maze_json_1 = __importDefault(require("../../public/tiles/maze.json"));
var mazeExits = [
    { x: 580, y: 73, name: "shop" },
    { x: 82, y: 1480, name: "shop" },
];
var dialogue = [
    {
        x: 130,
        y: 1482,
        properties: [
            {
                name: "message",
                value: "How on Earth did I end up here? I.. am still on Earth, right? I should be able to find the owner of the house by following this hallway down.",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "Ah, so we got a funny guy in charge of interior design.",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "Are you kidding me!? Oh I swear, once I find this guy...",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "LET ME OUT OF HERE!!!!!",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "Heavens. How many turns does this wallway have? And not a poster or window in sight! I wouldn't be surprised if this was the guy's dungeon and I found a prisoner in here! Hahaha. Actually, that's kind of scary. Onward.",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "This house looks familiar. All the furniture is gone, though. Maybe the guy who lived here moved away. Er.. what am I thinking? As if some guy lived in the middle of this awful maze.",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "Do my eyes deceive me!?",
            },
        ],
        hasAppeared: false,
    },
];
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        return _super.call(this, "maze") || this;
    }
    Game.prototype.preload = function () {
        //Load graphics for maze and player
        this.load.image("interior", "tiles/RPGW_HousesAndInt_v1.1/interiors.png");
        this.load.image("props", "tiles/RPGW_HousesAndInt_v1.1/decorative_props.png");
        this.load.image("furniture", "tiles/RPGW_HousesAndInt_v1.1/furniture.png");
        this.load.image("objects", "tiles/icons/icons.png");
        this.load.image("skull", "tiles/icons/individual/icon006.png");
        //Load data (collisions, etc) for the map.
        this.load.tilemapTiledJSON("maze", "tiles/maze.json");
        //Load keyboard for player to use.
        this.cursors = this.input.keyboard.createCursorKeys();
    };
    Game.prototype.create = function () {
        var _this = this;
        //Create tile sets so that we can access Tiled data later on.
        var map = this.make.tilemap({ key: "maze" });
        var buildingTileSet = map.addTilesetImage("Building", "interior");
        var mazeTileSet = map.addTilesetImage("house", "interior");
        var furnitureTileSet = map.addTilesetImage("Furniture", "furniture");
        var propsTileSet = map.addTilesetImage("props", "props");
        var allTileSets = [
            buildingTileSet,
            mazeTileSet,
            furnitureTileSet,
            propsTileSet,
        ];
        //Create ground layer first using tile set data.
        map.createLayer("subground", allTileSets);
        map.createLayer("ground", allTileSets);
        var wallsLayer = map.createLayer("walls", allTileSets);
        var furnitureLayer = map.createLayer("furniture", allTileSets);
        //Upon entering, remove token from overworld.
        localStorage.removeItem("from");
        this.player = this.physics.add.sprite(130, 1482, 
        // 494, End of maze for dev.
        // 73,
        "player", "shady_left_1");
        (0, helper_1.setPlayer)(this.player);
        (0, helper_1.createAnims)(this.anims);
        //Adds sprite for Skull object.
        this.add.image(580, 80, "skull");
        wallsLayer.setCollisionByProperty({ collides: true });
        furnitureLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, wallsLayer);
        this.physics.add.collider(this.player, furnitureLayer);
        var music = this.sound.add("race");
        var musicConfig = {
            mute: false,
            volume: 0.1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 1,
        };
        // music.play(musicConfig);
        //Message properties.
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
        // Hit spacebar to interact with objects.
        this.cursors.space.on("down", function () {
            (0, helper_1.interact)(0.03, _this.message, _this.player, maze_json_1.default.layers[3].objects, _this.sound.add("item"));
        }),
            // Hit shift to view Inventory.
            this.cursors.shift.on("down", function () {
                (0, helper_1.displayInventory)(_this.message, _this.player);
            });
    };
    Game.prototype.update = function (t, dt) {
        this.exits();
        this.playDialogue();
        this.cameras.main.scrollX = this.player.x - 400;
        this.cameras.main.scrollY = this.player.y - 300;
        var speed = this.message.text ? 0 : 200;
        (0, helper_1.movePlayer)(this.player, speed, this.cursors);
    };
    Game.prototype.exits = function () {
        var nextToTarget = (0, helper_1.isItClose)(0.03, this.player, mazeExits);
        if (nextToTarget) {
            if (this.player.y < 500) {
                localStorage.setItem("from", "mazeWin");
                localStorage.setItem("Skull", "What's it thinking?");
            }
            else {
                localStorage.setItem("from", "mazeFail");
            }
            window.scrollTo(700, 300);
            this.scene.stop("maze");
            this.scene.start(nextToTarget.name);
        }
    };
    Game.prototype.playDialogue = function () {
        var firstWrongTurn = dialogue[1];
        var secondWrongTurn = dialogue[2];
        var thirdWrongTurn = dialogue[3];
        var choicePath = dialogue[4];
        var enteringHouse = dialogue[5];
        var leavingMaze = dialogue[6];
        (0, helper_1.dialogueArea)(130, 190, 0, 1160, firstWrongTurn, this.player, this.message);
        (0, helper_1.dialogueArea)(800, 930, 1016, 1041, secondWrongTurn, this.player, this.message);
        (0, helper_1.dialogueArea)(550, 687, 625, 700, thirdWrongTurn, this.player, this.message);
        (0, helper_1.dialogueArea)(495, 615, 1399, 1410, choicePath, this.player, this.message);
        (0, helper_1.dialogueArea)(875, 940, 480, 660, enteringHouse, this.player, this.message);
        (0, helper_1.dialogueArea)(494, 500, 72, 97, leavingMaze, this.player, this.message);
        var dialogueSpot = (0, helper_1.isItClose)(0.03, this.player, dialogue);
        if (dialogueSpot && !dialogueSpot.hasAppeared) {
            if (this.message.text)
                this.message.text = "";
            (0, helper_1.updateText)(this.player, dialogueSpot, this.message);
            dialogueSpot.hasAppeared = true;
        }
    };
    return Game;
}(phaser_1.default.Scene));
exports.default = Game;
//# sourceMappingURL=Maze.js.map