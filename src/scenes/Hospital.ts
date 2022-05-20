import Phaser from "phaser";
import {
  isItClose,
  setPlayer,
  movePlayer,
  overworldExits,
  overworldObjs,
  createAnims,
  interact,
  displayInventory,
  updateText,
} from "../utils/helper";
import { debugDraw } from "../utils/debug";
import data from "../../public/tiles/hospital.json";

/**
 * Significant locations:
 * Upon entering: 105, 384
 * Entering the lab room: 550, 80
 * Monitor: 570, 472
 * By the desk: 280, 224
 *
 */

const hospitalExits = [
  { x: 422, y: 88, name: "scan" },
  { x: 635, y: 52, name: "shop" },
];

let roomLocked = true;

const dialogue = [
  {
    x: 105,
    y: 384,

    properties: [
      {
        name: "message",
        value:
          "The hospital is quiet with the hum of electricity. Your head continues to pound. There must be someone here who can help..",
      },
    ],
    hasAppeared: false,
  },
  {
    x: 454,
    y: 88,
    properties: [
      {
        name: "message",
        value: `"Hello. I’ve heard a little about your situation. What’s your name? ..You don't remember? Well, I'll administer some tests. Lie down on that bed, and once you hear the first loud beep, don't make a move! After about 7 passes, I'll let you know it's fine to get up."`,
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
        value: `"Good morning sir. Oh? You think you've hit your head? We can do some tests to see if you have any damage. We're slow today, so you can go see the doctor now. Head down the hall and take two lefts. I'll notify him of your situation."`,
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
        value: `"Argh, I told you to stay still! These photos are as blurry as a car crash! Lie down on that bed and try again. After the first beep, DON'T MOVE!"`,
      },
    ],
    pongResult: true,
    hasAppeared: false,
  },
  {
    x: 349,
    y: 85,
    properties: [
      {
        name: "message",
        value: `"Beautiful job lying there and doing nothing! Well, from a quick look at these scans, I can tell you good news and bad news. The good news is that your head looks fine! The bad news is, well, your head looks fine. So we don't know what's wrong. Er, just trying resting up. ..Pain meds? Oh don't be dramatic. Now, out with you!"`,
      },
    ],
    pongResult: true,
    hasAppeared: false,
  },
];

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private nurse!: Phaser.Physics.Arcade.Sprite;
  private doctor!: Phaser.Physics.Arcade.Sprite;
  private message!: Phaser.GameObjects.Text;

  constructor() {
    super("hospital");
  }

  preload() {
    //Load graphics for hospital map.
    this.load.image("items", "tiles/LabItems.png");
    this.load.image("building", "tiles/ModernTiles.png");
    this.load.tilemapTiledJSON("hospital", "tiles/hospital.json");

    //Load sprite data for doctor and nurse characters.
    this.load.atlas(
      "modern",
      "NPC_Characters_v1/modernsprites.png",
      "NPC_Characters_v1/modernsprites.json"
    );

    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.cameras.main.setSize(475, 300);

    //Create tile sets so that we can access Tiled data later on.
    const map = this.make.tilemap({ key: "hospital" });
    const buildingTileSet = map.addTilesetImage("futurevibes", "building");
    const labTileSet = map.addTilesetImage("labstuff", "items");
    const hospitalTilesets = [buildingTileSet, labTileSet];

    //Create ground layer first using tile set data.
    const floorLayer = map.createLayer("floor", hospitalTilesets);
    const floorObjLayer = map.createLayer("upper floor", hospitalTilesets);
    const lowObjLayer = map.createLayer("lower dead objects", hospitalTilesets);
    const highObjLayer = map.createLayer(
      "upper dead objects",
      hospitalTilesets
    );

    //Don't know if I need this.
    map.createFromObjects("objects", { id: 10 });
    map.createFromObjects("objects", { id: 341 });

    //Set collisions.
    floorLayer.setCollisionByProperty({ collides: true });
    floorObjLayer.setCollisionByProperty({ collides: true });
    lowObjLayer.setCollisionByProperty({ collides: true });
    highObjLayer.setCollisionByProperty({ collides: true });

    //Local helper function: if player is coming from the overworld, they appear at the entrance. If they are returning form the Brain Scan, they appear by the bed.
    this.spawn();

    this.physics.add.collider(this.player, lowObjLayer);
    this.physics.add.collider(this.player, highObjLayer);
    this.physics.add.collider(this.player, floorLayer);
    this.physics.add.collider(this.player, floorObjLayer);

    //Set player in the game, follow with camera, and animate.
    setPlayer(this.player);
    this.cameras.main.startFollow(this.player);
    createAnims(this.anims);

    //Add other charas.
    this.nurse = this.physics.add.sprite(283, 185, "modern", "nurse_front_1");
    this.doctor = this.physics.add.sprite(328, 86, "modern", "thedoc_right_1");

    //Initialize message and item sound.
    this.message = this.add.text(800, 750, "", {
      color: "#FFF5EE",
      fontFamily: "Tahoma",
      backgroundColor: "#708090",
      fontSize: "17px",
      align: "center",
      baselineX: 0,
      baselineY: 0,
      padding: 0,
      wordWrap: { width: 350 },
    });
    this.sound.add("item");

    // Hit spacebar to interact with objects.
    this.cursors.space.on("down", () => {
      console.log(data);
      console.log(displayInventory);
      interact(
        this.message,
        this.player,
        data.layers[4].objects,
        this.sound.add("item")
      );
    }),
      // Hit shift to view Inventory.
      this.cursors.shift.on("down", () => {
        return displayInventory(this.message, this.player);
      }),
      debugDraw(floorLayer, this);
    debugDraw(highObjLayer, this);
    debugDraw(lowObjLayer, this);
  }

  update(t: number, dt: number) {
    this.exits();
    this.checkKeycard();
    this.playDialogue();

    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    let speed = this.message.text ? 0 : 120;
    movePlayer(this.player, speed, this.cursors);
  }

  exits() {
    if (this.player.y > 575) {
      localStorage.setItem("from", `hospital`);
      this.scene.stop("hospital");
      this.scene.start("game");
    }

    let nextToTarget = isItClose(this.player, hospitalExits);
    if (nextToTarget) {
      if (
        nextToTarget.name === "scan" &&
        localStorage["Brain Scan"] === "CLEAR"
      ) {
      } else {
        localStorage.setItem("from", `hospital`);
        this.scene.stop("hospital");
        this.scene.start(nextToTarget.name);
      }
    }
  }

  checkKeycard() {
    if (roomLocked && this.player.x > 560 && this.player.y > 458) {
      let goodMonitor = {
        properties: [
          { name: "message", value: "Access granted! Welcome, Doctor PASCAL." },
        ],
      };
      let badMonitor = {
        properties: [
          {
            name: "message",
            value: "Access denied. Please enter holding your keycard.",
          },
        ],
      };

      if (localStorage["keycard"]) {
        this.player.setPosition(this.player.x, this.player.y + 5);
        updateText(this.player, goodMonitor, this.message);
        roomLocked = false;
      } else {
        this.player.setPosition(this.player.x, this.player.y - 5);
        updateText(this.player, badMonitor, this.message);
      }
    }
  }

  playDialogue() {
    let dialogueSpot = isItClose(this.player, dialogue);
    if (dialogueSpot && !dialogueSpot.hasAppeared) {
      if (this.message.text) this.message.text = "";
      if (dialogueSpot.pongResult) {
        if (localStorage["Brain Scan"] === "CLEAR") {
          updateText(this.player, dialogueSpot, this.message);
          dialogueSpot.hasAppeared = true;
          dialogue[4].hasAppeared = true;
        } else {
          updateText(this.player, dialogueSpot, this.message);
          dialogueSpot.hasAppeared = true;
        }
      } else {
        updateText(this.player, dialogueSpot, this.message);
        dialogueSpot.hasAppeared = true;
      }
    }
  }

  spawn() {
    if (localStorage["from"] === "overworld") {
      localStorage.removeItem("from");
      this.player = this.physics.add.sprite(
        105,
        530,
        "player",
        "doc-walk-up-0"
      );
    } else if (localStorage["Brain Scan"] === "CLEAR") {
      this.player = this.physics.add.sprite(
        349,
        85,
        "player",
        "doc-walk-side-0"
      );
      dialogue.forEach((textObj) => {
        textObj.hasAppeared = true;
      });
      dialogue[4].hasAppeared = false;
    } else if (localStorage["Brain Scan"] === "TOO BLURRY") {
      this.player = this.physics.add.sprite(
        359.5,
        84,
        "player",
        "doc-walk-side-0"
      );
    }
  }
}
