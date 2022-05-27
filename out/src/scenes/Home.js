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
var home_json_1 = __importDefault(require("../../public/tiles/home.json"));
var homeExits = [{ x: 210, y: 278, name: "game" }];
var windowCount = 0;
var dialogue = [
    {
        x: 152,
        y: 57,
        properties: [
            {
                name: "message",
                value: "And I'm up! What on Earth... Whose voice was that just now? Ergh, I must have drank too much last night. Damn it! I'm so hungry, too.",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "Alright, well that's more than a regular headache. What is this place? Feels like home.. but I don't recognize it. I should see my doctor. Doctor, uh.. whatshisname? Yeah, this ain't right.",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "Empty plates, and no food around.",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "OH? I must be dizzier than I thought.",
            },
        ],
        hasAppeared: false,
    },
];
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        return _super.call(this, "home") || this;
    }
    Game.prototype.preload = function () {
        //loading building tilesets
        this.load.image("interior", "tiles/RPGW_HousesAndInt_v1.1/interiors.png");
        this.load.image("furniture", "tiles/RPGW_HousesAndInt_v1.1/furniture.png");
        this.load.image("letter", "tiles/icons/individual/icon384.png");
        this.load.image("items", "tiles/LabItems.png");
        //Load data (collisions, etc) for the map.
        this.load.tilemapTiledJSON("home", "tiles/home.json");
        //Load keyboard for player to use.
        this.cursors = this.input.keyboard.createCursorKeys();
    };
    Game.prototype.create = function () {
        var _this = this;
        //Create tile sets
        var map = this.make.tilemap({ key: "home" });
        var interiorTileSet = map.addTilesetImage("interior", "interior");
        var furnitureTileSet = map.addTilesetImage("furniture", "furniture");
        var noteTileSet = map.addTilesetImage("note", "letter");
        var itemTileSet = map.addTilesetImage("labstuff", "items");
        var homeTileSets = [interiorTileSet, furnitureTileSet];
        //Building layers
        map.createLayer("ground", homeTileSets);
        var wallsLayer = map.createLayer("walls", homeTileSets);
        var furnitureLayer = map.createLayer("furniture", homeTileSets);
        var noteLayer = map.createLayer("note", noteTileSet);
        if (localStorage["Brain Scan"] === "A beautiful mind." ||
            localStorage["Keycard"] === "Dr. Pascal's keycard." ||
            localStorage["Heart"] === "It's not beating") {
            var newItemsLayer = map.createLayer("newitems", [
                noteTileSet,
                itemTileSet,
            ]);
        }
        map.createFromObjects("object", { id: 1 });
        this.spawn();
        (0, helper_1.setPlayer)(this.player);
        (0, helper_1.createAnims)(this.anims);
        this.cameras.main.centerOn(152, 27);
        wallsLayer.setCollisionByProperty({ collides: true });
        furnitureLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, wallsLayer);
        this.physics.add.collider(this.player, furnitureLayer);
        //this.physics.add.collider(this.player, objectsLayer);
        this.message = this.add
            .text(800, 750, "", {
            color: "#FFF5EE",
            fontFamily: "Tahoma",
            backgroundColor: "#708090",
            fontSize: "17px",
            align: "center",
            baselineX: 0,
            baselineY: 0,
            wordWrap: { width: 350 },
        })
            .setPadding(5, 5, 5, 5);
        this.sound.add("item");
        // Hit spacebar to interact with objects.
        this.cursors.space.on("down", function () {
            if ((0, helper_1.isItClose)(0.05, _this.player, [{ x: 205, y: 57, width: 10, height: 20 }])) {
                windowCount++;
                _this.sound.play("knock");
            }
            if (localStorage["Brain Scan"] !== "A beautiful mind." &&
                localStorage["Heart"] !== "It's not beating." &&
                _this.player.x < 176 &&
                _this.player.y > 158) {
                return;
            }
            (0, helper_1.interact)(0.15, _this.message, _this.player, home_json_1.default.layers[5].objects, _this.sound.add("item"));
        }),
            // Hit shift to view Inventory.
            this.cursors.shift.on("down", function () {
                (0, helper_1.displayInventory)(_this.message, _this.player);
            });
        // debugDraw(wallsLayer, this);
        // debugDraw(furnitureLayer, this);
        // debugDraw(objectsLayer, this);
    };
    Game.prototype.update = function (t, dt) {
        this.exits();
        this.playDialogue();
        if (localStorage["Heart"]) {
            dialogue.forEach(function (message) {
                message.hasAppeared = true;
            });
        }
        this.cameras.main.scrollX = this.player.x - 400;
        this.cameras.main.scrollY = this.player.y - 300;
        this.cameras.main.zoom = 1.2;
        var speed = this.message.text ? 0 : 120;
        (0, helper_1.movePlayer)(this.player, speed, this.cursors);
    };
    Game.prototype.exits = function () {
        var nextToTarget = (0, helper_1.isItClose)(0.03, this.player, homeExits);
        if (nextToTarget) {
            if (nextToTarget.name === "game" && windowCount !== 2) {
                this.player.setPosition(152, 57);
                windowCount = 0;
                this.sound.play("warp");
                (0, helper_1.updateText)(this.player, dialogue[3], this.message);
                dialogue[3].hasAppeared = true;
                return;
            }
            localStorage.setItem("from", "home");
            this.scene.stop("home");
            this.sound.play("door");
            window.scrollTo(250, 0);
            this.scene.start(nextToTarget.name);
        }
    };
    Game.prototype.playDialogue = function () {
        var movingAround = dialogue[1];
        var hungies = dialogue[2];
        if (this.player.y > 87 && !movingAround.hasAppeared) {
            if (this.message.text)
                this.message.text = "";
            this.sound.play("error");
            (0, helper_1.updateText)(this.player, movingAround, this.message);
            movingAround.hasAppeared = true;
        }
        if (this.player.y > 217 && this.player.x > 210 && !hungies.hasAppeared) {
            if (this.message.text)
                this.message.text = "";
            (0, helper_1.updateText)(this.player, hungies, this.message);
            hungies.hasAppeared = true;
        }
        var dialogueSpot = (0, helper_1.isItClose)(0.03, this.player, dialogue);
        if (dialogueSpot && !dialogueSpot.hasAppeared) {
            if (this.message.text)
                this.message.text = "";
            (0, helper_1.updateText)(this.player, dialogueSpot, this.message);
            dialogueSpot.hasAppeared = true;
        }
    };
    Game.prototype.spawn = function () {
        if (localStorage["from"] === "overworld") {
            localStorage.removeItem("from");
            this.player = this.physics.add.sprite(207, 255, "player", "shady_back_1");
        }
        else {
            this.player = this.physics.add.sprite(152, 57, "player", "shady_front_1");
        }
    };
    return Game;
}(phaser_1.default.Scene));
exports.default = Game;
//# sourceMappingURL=Home.js.map