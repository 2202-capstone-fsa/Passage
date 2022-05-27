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
var hospital_json_1 = __importDefault(require("../../public/tiles/hospital.json"));
var roomLocked = true;
var hospitalExits = [{ x: 422, y: 88, name: "scan" }];
var dialogue = [
    {
        x: 105,
        y: 384,
        properties: [
            {
                name: "message",
                value: "The hospital is quiet with the hum of electricity. Your head continues to pound. There must be someone here who can help..",
            },
        ],
        hasAppeared: false,
    },
    {
        x: 454,
        y: 89,
        properties: [
            {
                name: "message",
                value: "\"Hello. I\u2019ve heard a little about your situation. What\u2019s your name? ..You don't remember? Well, I'll administer some tests. Lie down on that bed, and once you hear the first loud beep and see a red flash, don't make a move! After about 7 passes, I'll let you know it's fine to get up.\"",
            },
        ],
        hasAppeared: false,
    },
    {
        x: 283,
        y: 216,
        properties: [
            {
                name: "message",
                value: "\"Good morning sir. Oh? You think you've hit your head? We can do some tests to see if you have any damage. We're slow today, so you can go see the doctor now. Head down the hall and take two lefts. I'll notify him of your situation.\"",
            },
        ],
        hasAppeared: false,
    },
    {
        x: 359.5,
        y: 84,
        properties: [
            {
                name: "message",
                value: "\"Argh, I told you to stay still! These photos are as blurry as a car crash!!! Lie down on that bed and try again. After the first beep and red flash, DON'T MOVE!\"",
            },
        ],
        pongResult: true,
        hasAppeared: false,
    },
    {
        x: 385,
        y: 89,
        properties: [
            {
                name: "message",
                value: "\"Beautiful job lying there and doing nothing! Let me see. The good news is that your head looks fine! The bad news is, well, your head looks fine. So we don't know what's wrong with you. Er, try resting up. ...Pain meds? Oh don't be dramatic.\"",
            },
        ],
        pongResult: true,
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "These people ain't right.",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "\"The room at the end of the right hall? That's for one of our doctors, who isn't here today. No one is permitted access there except for him. If you want to ask him about it, I believe he takes visitors at his house in the center of town.\"",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "What.. am I supposed to be here?",
            },
        ],
        hasAppeared: false,
    },
    {
        properties: [
            {
                name: "message",
                value: "Oh my god! There's a human heart in here! Should I... take it? For science?",
            },
        ],
        hasAppeared: false,
    },
];
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        return _super.call(this, "hospital") || this;
    }
    Game.prototype.preload = function () {
        //Load graphics for hospital map.
        this.load.image("items", "tiles/LabItems.png");
        this.load.image("hospitalFoundation", "tiles/ModernTiles.png");
        this.load.tilemapTiledJSON("hospital", "tiles/hospital.json");
        //Load sprite data for doctor and nurse characters.
        this.load.atlas("modern", "NPC_Characters_v1/modernsprites.png", "NPC_Characters_v1/modernsprites.json");
        //Load keyboard for player to use.
        this.cursors = this.input.keyboard.createCursorKeys();
    };
    Game.prototype.create = function () {
        var _this = this;
        //Create cameras and add sound for lighting.
        this.cameras.main.setSize(575.5, 300.5);
        this.lights = this.sound.add("lights");
        var lightsConfig = {
            mute: false,
            volume: 0.02,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 1,
        };
        this.lights.play(lightsConfig);
        window.scrollTo(0, 0);
        //Create tile sets so that we can access Tiled data later on.
        var map = this.make.tilemap({ key: "hospital" });
        var buildingTileSet = map.addTilesetImage("futurevibes", "hospitalFoundation");
        var labTileSet = map.addTilesetImage("labstuff", "items");
        var hospitalTilesets = [buildingTileSet, labTileSet];
        //Create ground layer first using tile set data.
        var floorLayer = map.createLayer("floor", hospitalTilesets);
        var floorObjLayer = map.createLayer("upper floor", hospitalTilesets);
        var lowObjLayer = map.createLayer("lower dead objects", hospitalTilesets);
        var highObjLayer = map.createLayer("upper dead objects", hospitalTilesets);
        //Objects.
        map.createFromObjects("objects", { id: 10 });
        map.createFromObjects("objects", { id: 341 });
        //Set collisions.
        floorLayer.setCollisionByProperty({ collides: true });
        floorObjLayer.setCollisionByProperty({ collides: true });
        lowObjLayer.setCollisionByProperty({ collides: true });
        highObjLayer.setCollisionByProperty({ collides: true });
        //Local helper function: if player is coming from the overworld, they appear at the entrance. If they are returning form the Brain Scan, they appear by the bed.
        this.spawn();
        //Follow with camera and animate.
        (0, helper_1.setPlayer)(this.player);
        this.cameras.main.startFollow(this.player);
        (0, helper_1.createAnims)(this.anims);
        //Add other charas.
        this.nurse = this.physics.add.sprite(283, 185, "modern", "nurse_front_1");
        this.nurse.alpha = 0.5;
        this.doctor = this.physics.add.sprite(328, 86, "modern", "thedoc_right_1");
        this.doctor.alpha = 0.5;
        this.doctor.setImmovable(true);
        this.physics.add.collider(this.player, lowObjLayer);
        this.physics.add.collider(this.player, highObjLayer);
        this.physics.add.collider(this.player, floorLayer);
        this.physics.add.collider(this.player, floorObjLayer);
        this.physics.add.collider(this.player, this.doctor);
        //Initialize message and item sound.
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
        this.sound.add("item");
        // Hit spacebar to interact with objects.
        this.cursors.space.on("down", function () {
            (0, helper_1.interact)(0.03, _this.message, _this.player, hospital_json_1.default.layers[4].objects, _this.sound.add("item"));
        }),
            // Hit shift to view Inventory.
            this.cursors.shift.on("down", function () {
                return (0, helper_1.displayInventory)(_this.message, _this.player);
            });
    };
    Game.prototype.update = function (t, dt) {
        this.exits();
        this.checkKeycard();
        this.playDialogue();
        this.cameras.main.scrollX = this.player.x - 400;
        this.cameras.main.scrollY = this.player.y - 300;
        var speed = this.message.text ? 0 : 120;
        (0, helper_1.movePlayer)(this.player, speed, this.cursors);
    };
    Game.prototype.exits = function () {
        if (this.player.y > 575) {
            localStorage.setItem("from", "hospital");
            this.lights.stop();
            this.scene.stop("hospital");
            this.scene.start("game");
        }
        var nextToTarget = (0, helper_1.isItClose)(0.03, this.player, hospitalExits);
        if (nextToTarget) {
            if (nextToTarget.name === "scan") {
                window.scrollTo(130, 0);
            }
            if (nextToTarget.name === "scan" &&
                localStorage["Brain Scan"] === "A beautiful mind.") {
                return;
            }
            else {
                localStorage.setItem("from", "hospital");
                this.lights.stop();
                this.scene.stop("hospital");
                this.scene.start(nextToTarget.name);
            }
        }
    };
    Game.prototype.checkKeycard = function () {
        if (roomLocked && this.player.x > 560 && this.player.y > 458) {
            var goodMonitor = {
                properties: [
                    { name: "message", value: "Access granted! Welcome, Doctor PASCAL." },
                ],
            };
            var badMonitor = {
                properties: [
                    {
                        name: "message",
                        value: "Access denied. Please enter holding your keycard.",
                    },
                ],
            };
            if (localStorage["Keycard"] === "Dr. Pascal's keycard.") {
                this.player.setPosition(this.player.x, this.player.y + 5);
                (0, helper_1.updateText)(this.player, goodMonitor, this.message);
                this.sound.play("complete");
                roomLocked = false;
            }
            else {
                this.player.setPosition(this.player.x, this.player.y - 5);
                (0, helper_1.updateText)(this.player, badMonitor, this.message);
            }
        }
    };
    Game.prototype.playDialogue = function () {
        var intro = dialogue[0];
        var meetDoctor = dialogue[1];
        var meetNurse = dialogue[2];
        var fail = dialogue[3];
        var success = dialogue[4];
        var comment = dialogue[5];
        var roomInfo = dialogue[6];
        var enterLab = dialogue[7];
        var garbageHeart = dialogue[8];
        if (localStorage["Brain Scan"] === "A beautiful mind.") {
            meetNurse.hasAppeared = true;
            (0, helper_1.dialogueArea)(480, 624, 264, 322, comment, this.player, this.message);
            (0, helper_1.dialogueArea)(320, 400, 40, 100, success, this.player, this.message);
            (0, helper_1.dialogueArea)(270, 295, 216, 220, roomInfo, this.player, this.message);
        }
        else if (localStorage["Brain Scan"] ===
            "Too blurry! The doctor can't interpret this.") {
            (0, helper_1.dialogueArea)(320, 400, 40, 100, fail, this.player, this.message);
        }
        (0, helper_1.dialogueArea)(48, 150, 329, 359, intro, this.player, this.message);
        (0, helper_1.dialogueArea)(270, 295, 216, 220, meetNurse, this.player, this.message);
        (0, helper_1.dialogueArea)(400, 485, 70, 98, meetDoctor, this.player, this.message);
        (0, helper_1.dialogueArea)(530, 550, 455, 562, enterLab, this.player, this.message);
        (0, helper_1.dialogueArea)(495, 520, 472, 480, garbageHeart, this.player, this.message);
    };
    Game.prototype.spawn = function () {
        if (localStorage["from"] === "overworld") {
            localStorage.removeItem("from");
            this.player = this.physics.add.sprite(105, 530, "player", "shady_back_1");
        }
        else if (localStorage["Brain Scan"] === "A beautiful mind.") {
            localStorage.removeItem("from");
            this.player = this.physics.add.sprite(349, 85, "player", "shady_left_1");
            // dialogue.forEach((textObj) => {
            //   textObj.hasAppeared = true;
            // });
            // dialogue[4].hasAppeared = false;
        }
        else if (localStorage["Brain Scan"] ===
            "Too blurry! The doctor can't interpret this.") {
            localStorage.removeItem("from");
            this.player = this.physics.add.sprite(359.5, 84, "player", "shady_left_1");
        }
    };
    return Game;
}(phaser_1.default.Scene));
exports.default = Game;
//# sourceMappingURL=Hospital.js.map