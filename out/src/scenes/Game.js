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
//import data from "../tiles/overworld.json";
var overworld_json_1 = __importDefault(require("../../public/tiles/overworld.json"));
var helper_1 = require("../utils/helper");
var overworldExits = [
    { x: 320, y: 1170, name: "shop", scroll: { x: 700, y: 300 } },
    { x: 1234, y: 465, name: "hospital", scroll: { x: 0, y: 0 } },
    { x: 803, y: 216, name: "atlantis", scroll: { x: 0, y: 200 } },
    { x: 788, y: 1060, name: "home", scroll: { x: 200, y: 100 } },
    { x: 794, y: 1586, name: "ending", scroll: { x: 500, y: 500 } },
    // {
    //   x: 794,
    //   y: 1500,
    //   name: "nearEnd",
    //   message: "You are near the end, no going back, are you sure?",
    // },
];
var waterfallLocked = true;
var dialogue = [
    {
        properties: [
            {
                name: "message",
                value: "The road ahead looks daunting. You feel as though if you step ahead of this path, the consequences of your actions will come flooding forward. Are you satisfied with your progress? If you are, the road implores you to step forward.",
            },
        ],
        hasAppeared: false,
    },
    {
        x: 788,
        y: 1101,
        properties: [
            {
                name: "message",
                value: "I'm out! Finally. Now, about this noggin.. There's gotta be a hospital around here. Say.. what a nice town. Aren't there any people?",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "You hear a light snoring coming from inside, but no matter how much you knock nobody comes to the door.",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "There's a chatter in the distance, but it almost feels like it's coming from the yard than inside the house.",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "Nobody is home. A chill runs down your spine when you get close to the door.",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "Whew. I could use a drink... Maybe that doctor's drink I smuggled will do. Ooh... yes that's good. I feel like I'm in my twenties again!",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "A lady's voice: \"That doctor on the Northeast side of town. He would never go... His heart paid the price.\"",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "A lady's voice: \"A beautiful mind and a beautiful heart. He was so funny, too... Made me feel like myself when I was around him. What part of a person does that? Their soul?\"",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "A lady's voice: \"That soul of his, I'm sure it's still here with me. It has to be. When I scattered his ashes at the beach, it felt like he... became part of the wind? Yes, the wind.\"",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "A lady's voice whispers: \"I wish he went to the doctor sooner.\"",
            },
        ],
        hasAppeared: false,
    },
];
var goToEnd = dialogue[0];
var toSandbox = dialogue[8];
var toWaterfall = dialogue[7];
var toHospital = dialogue[6];
var hasSoda = dialogue[5];
var southeastHome = dialogue[4];
var westHome = dialogue[3];
var northWestHome = dialogue[2];
var shopLock = dialogue[9];
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        return _super.call(this, "game") || this;
    }
    Game.prototype.preload = function () {
        //Load graphics
        this.load.image("houses", "tiles/overworld/houses.png");
        this.load.image("outside", "tiles/overworld/outside.png");
        this.load.image("jungle", "tiles/overworld/jungle.png");
        this.load.image("beach", "tiles/overworld/beach.png");
        this.load.image("clouds", "tiles/overworld/clouds.png");
        this.load.image("icons", "tiles/icons/icons.png");
        //Load data (collisions, etc) for the map.
        this.load.tilemapTiledJSON("overworld", "tiles/overworld.json");
        //Load keyboard for player to use.
        this.cursors = this.input.keyboard.createCursorKeys();
    };
    Game.prototype.create = function () {
        var _this = this;
        window.scrollTo(200, 200);
        this.cameras.main.setSize(625.5, 400.5);
        //Create tile sets so that we can access Tiled data later on.
        var map = this.make.tilemap({ key: "overworld" });
        var townTileSet = map.addTilesetImage("Town", "outside");
        var houseTileSet = map.addTilesetImage("Houses", "houses");
        var jungleTileSet = map.addTilesetImage("Jungle", "jungle");
        var beachTileSet = map.addTilesetImage("Beach", "beach");
        var cloudsTileSet = map.addTilesetImage("Clouds", "clouds");
        var iconsTileSet = map.addTilesetImage("Icons", "icons");
        var allTileSet = [
            houseTileSet,
            townTileSet,
            beachTileSet,
            jungleTileSet,
            cloudsTileSet,
            iconsTileSet,
        ];
        //Create ground layer first using tile set data.
        var groundLayer = map.createLayer("Ground", allTileSet);
        var groundDeluxeLayer = map.createLayer("GroundDeluxe", allTileSet);
        //Local helper function: if player is coming from the overworld, they appear at the entrance. If they are returning form the Brain Scan, they appear by the bed.
        this.spawn();
        //Follow with camera and animate.
        (0, helper_1.setPlayer)(this.player);
        (0, helper_1.createAnims)(this.anims);
        //Create houses and walls in this world, over the Ground and Player.
        var housesLayer = map.createLayer("Houses", allTileSet);
        var wallsLayer = map.createLayer("Walls", allTileSet);
        if (localStorage["Skull"]) {
            var waterfallLayer = map.createLayer("Waterfall", allTileSet);
            waterfallLayer.setCollisionByProperty({ collides: true });
            this.physics.add.collider(this.player, waterfallLayer);
        }
        //Set walls and houses to collide with Player.
        wallsLayer.setCollisionByProperty({ collides: true });
        housesLayer.setCollisionByProperty({ collides: true });
        groundDeluxeLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, wallsLayer);
        this.physics.add.collider(this.player, housesLayer);
        this.physics.add.collider(this.player, groundDeluxeLayer);
        //Initialize message and item sound.
        this.message = this.add
            .text(400, 300, "", {
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
        var item = this.sound.add("item");
        var door = this.sound.add("door");
        this.warning = 0;
        var wind = this.sound.add("wind");
        var windConfig = {
            mute: false,
            volume: 0.2,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 3,
        };
        localStorage.Soul ? wind.play(windConfig) : null;
        // Hit spacebar to interact with objects.
        this.cursors.space.on("down", function () {
            (0, helper_1.interact)(0.03, _this.message, _this.player, overworld_json_1.default.layers[5].objects, item);
        }),
            // Hit shift to view Inventory.
            this.cursors.shift.on("down", function () {
                (0, helper_1.displayInventory)(_this.message, _this.player);
            });
        //debugDraw(wallsLayer, this);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.zoom = 1.1;
        /*
        Body obj: 160, 116. Width + Height 15.
        */
    };
    Game.prototype.update = function (t, dt) {
        if (this.message.text === "") {
            this.message.setPadding(0, 0, 0, 0);
        }
        if (!this.cursors || !this.player) {
            return;
        }
        this.playDialogue();
        this.message.x = this.player.x - 100;
        this.message.y = this.player.y + 50;
        // Enter a scene when near.
        this.exits();
        this.accessWaterfall();
        //Empty inventory progressively.
        if (localStorage["Keycard"] === "Dr. Pascal's keycard.") {
            localStorage.removeItem("Brain Scan");
        }
        // Camera that follows
        this.cameras.main.scrollX = this.player.x - 400;
        this.cameras.main.scrollY = this.player.y - 300;
        // movement
        var speed = this.message.text ? 0 : 120;
        if (localStorage["Dr. Cola"] === "A yummy fizzy drink that doctors love!") {
            speed = this.message.text ? 0 : 180;
        }
        (0, helper_1.movePlayer)(this.player, speed, this.cursors);
    };
    Game.prototype.spawn = function () {
        /* Add Player sprite to the game.
          In the sprite json file, for any png of sprites,
          the first set of sprites is called "green"
          the second set is called "teal"
          the third set is called "brown"
          and the fourth set is called "doc"
        */
        if (localStorage.from === "hospital") {
            localStorage.removeItem("from");
            this.player = this.physics.add.sprite(1250, 526, "player", "shady_front_1");
        }
        else if (localStorage.from === "shop") {
            localStorage.removeItem("from");
            this.player = this.physics.add.sprite(320, 1220, "player", "shady_front_1");
        }
        else if (localStorage.from === "home") {
            localStorage.removeItem("from");
            this.player = this.physics.add.sprite(788, 1100, "player", "shady_front_1");
        }
        else if (localStorage.from === "atlantis") {
            localStorage.removeItem("from");
            this.player = this.physics.add.sprite(808, 240, "player", "shady_front_1");
        }
        else {
            localStorage.removeItem("from");
            this.player = this.physics.add.sprite(800, 800, "player", "shady_front_1");
        }
    };
    Game.prototype.playDialogue = function () {
        if (goToEnd.hasAppeared && this.player.y < 1455) {
            goToEnd.hasAppeared = false;
        }
        if (localStorage.Heart !== "It's not beating." && this.player.x > 430) {
            shopLock.hasAppeared = false;
        }
        (0, helper_1.dialogueArea)(1290, 1340, 1192, 1207, southeastHome, this.player, this.message);
        (0, helper_1.dialogueArea)(170, 200, 616, 625, westHome, this.player, this.message);
        (0, helper_1.dialogueArea)(404, 440, 312, 322, northWestHome, this.player, this.message);
        (0, helper_1.dialogueArea)(704, 890, 1111, 1337, toHospital, this.player, this.message);
        if (localStorage["Dr. Cola"] === "A yummy fizzy drink that doctors love!" &&
            !hasSoda.hasAppeared) {
            (0, helper_1.updateText)(this.player, hasSoda, this.message);
            hasSoda.hasAppeared = true;
        }
        if (localStorage["Skull"] === "What's it thinking?") {
            (0, helper_1.dialogueArea)(270, 380, 1190, 1340, toWaterfall, this.player, this.message);
        }
        if (localStorage["Soul"]) {
            (0, helper_1.dialogueArea)(742, 866, 150, 280, toSandbox, this.player, this.message);
        }
        if (this.player.y > 1490 &&
            this.player.x > 749 &&
            this.player.x < 842 &&
            !goToEnd.hasAppeared) {
            if (this.message.text)
                this.message.text = "";
            (0, helper_1.updateText)(this.player, dialogue[0], this.message);
            dialogue[0].hasAppeared = true;
        }
        else {
            var dialogueSpot = (0, helper_1.isItClose)(0.03, this.player, dialogue);
            if (dialogueSpot && !dialogueSpot.hasAppeared) {
                if (this.message.text)
                    this.message.text = "";
                (0, helper_1.updateText)(this.player, dialogueSpot, this.message);
                dialogueSpot.hasAppeared = true;
            }
        }
    };
    Game.prototype.exits = function () {
        //Warps the player around the left and right ends of the map.
        if (this.player.x < 20 && this.player.y < 785 && this.player.y > 680)
            this.player.setPosition(1575, 790);
        if (this.player.x > 1585 && this.player.y > 745 && this.player.y < 840)
            this.player.setPosition(25, 728);
        var exit = (0, helper_1.isItClose)(0.03, this.player, overworldExits);
        if (exit) {
            //Checks if hospital is complete in order to enter Shop.
            if (exit.name === "shop" && localStorage.Heart !== "It's not beating.") {
                (0, helper_1.dialogueArea)(300, 350, 1150, 1200, shopLock, this.player, this.message);
                return;
            }
            if (exit.scroll) {
                window.scroll(exit.scroll.x, exit.scroll.y);
            }
            localStorage.setItem("from", "overworld");
            this.scene.stop("game");
            if (exit.name === "atlantis") {
                this.sound.play("splash");
            }
            else {
                this.sound.play("door");
            }
            this.scene.start(exit.name);
        }
    };
    Game.prototype.accessWaterfall = function () {
        if (waterfallLocked &&
            ((this.player.x < 1182 && this.player.y < 656) || this.player.y < 380)) {
            var access = {
                properties: [
                    { name: "message", value: "Oh my. What's all that, over there?" },
                ],
            };
            var noAccess = {
                properties: [
                    {
                        name: "message",
                        value: "A voice calls: \"I pray he finds guidance on his way.\"",
                    },
                ],
            };
            if (localStorage["Skull"] === "What's it thinking?") {
                this.player.setPosition(this.player.x, this.player.y + 5);
                (0, helper_1.updateText)(this.player, access, this.message);
                waterfallLocked = false;
            }
            else {
                this.player.setPosition(this.player.x, this.player.y + 5);
                (0, helper_1.updateText)(this.player, noAccess, this.message);
            }
        }
    };
    return Game;
}(phaser_1.default.Scene));
exports.default = Game;
//# sourceMappingURL=Game.js.map