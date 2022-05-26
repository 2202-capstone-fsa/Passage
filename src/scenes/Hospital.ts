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
  dialogueArea,
} from "../utils/helper";
import { debugDraw } from "../utils/debug";
import data from "../../public/tiles/hospital.json";

let roomLocked = true;
const hospitalExits = [{ x: 422, y: 88, name: "scan" }];
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
    y: 89,
    properties: [
      {
        name: "message",
        value: `"Hello. I’ve heard a little about your situation. What’s your name? ..You don't remember? Well, I'll administer some tests. Lie down on that bed, and once you hear the first loud beep and see a red flash, don't make a move! After about 7 passes, I'll let you know it's fine to get up."`,
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
        value: `"Argh, I told you to stay still! These photos are as blurry as a car crash!!! Lie down on that bed and try again. After the first beep and red flash, DON'T MOVE!"`,
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
        value: `"Beautiful job lying there and doing nothing! Let me see. The good news is that your head looks fine! The bad news is, well, your head looks fine. So we don't know what's wrong with you. Er, try resting up. ...Pain meds? Oh don't be dramatic."`,
      },
    ],
    pongResult: true,
    hasAppeared: false,
  },
  {
    properties: [
      {
        name: "message",
        value: `These people ain't right.`,
      },
    ],
    hasAppeared: false,
  },
  {
    properties: [
      {
        name: "message",
        value: `"The room at the end of the right hall? That's for one of our doctors, who isn't here today. No one is permitted access there except for him. If you want to ask him about it, I believe he takes visitors at his house in the center of town."`,
      },
    ],
    hasAppeared: false,
  },
  {
    properties: [
      {
        name: "message",
        value: `What.. am I supposed to be here?`,
      },
    ],
    hasAppeared: false,
  },
  {
    properties: [
      {
        name: "message",
        value: `Oh my god! There's a human heart in here! Should I... take it? For science?`,
      },
    ],
    hasAppeared: false,
  },
];

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private nurse!: Phaser.Physics.Arcade.Sprite;
  private doctor!: Phaser.Physics.Arcade.Sprite;
  private message!: Phaser.GameObjects.Text;
  private lights!: Phaser.sound;

  constructor() {
    super("hospital");
  }

  preload() {
    //Load graphics for hospital map.
    this.load.image("items", "tiles/LabItems.png");
    this.load.image("hospitalFoundation", "tiles/ModernTiles.png");
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
    //Create cameras and add sound for lighting.
    this.cameras.main.setSize(575.5, 300.5);
    this.lights = this.sound.add("lights");
    let lightsConfig = {
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
    const map = this.make.tilemap({ key: "hospital" });
    const buildingTileSet = map.addTilesetImage(
      "futurevibes",
      "hospitalFoundation"
    );
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
    setPlayer(this.player);
    this.cameras.main.startFollow(this.player);
    createAnims(this.anims);

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
      padding: 0,
      wordWrap: { width: 350 },
    });
    this.sound.add("item");

    // Hit spacebar to interact with objects.
    this.cursors.space.on("down", () => {
      interact(
        0.03,
        this.message,
        this.player,
        data.layers[4].objects,
        this.sound.add("item")
      );
    }),
      // Hit shift to view Inventory.
      this.cursors.shift.on("down", () => {
        return displayInventory(this.message, this.player);
      });
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
      this.lights.stop();
      this.scene.stop("hospital");
      this.scene.start("game");
    }

    let nextToTarget = isItClose(0.03, this.player, hospitalExits);
    if (nextToTarget) {
      if (nextToTarget.name === "scan") {
        window.scrollTo(130, 0);
      }
      if (
        nextToTarget.name === "scan" &&
        localStorage["Brain Scan"] === "A beautiful mind."
      ) {
        return;
      } else {
        localStorage.setItem("from", `hospital`);
        this.lights.stop();
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

      if (localStorage["Keycard"] === "Dr. Pascal's keycard.") {
        this.player.setPosition(this.player.x, this.player.y + 5);
        updateText(this.player, goodMonitor, this.message);
        this.sound.play("complete");
        roomLocked = false;
      } else {
        this.player.setPosition(this.player.x, this.player.y - 5);
        updateText(this.player, badMonitor, this.message);
      }
    }
  }

  playDialogue() {
    const intro = dialogue[0];
    const meetDoctor = dialogue[1];
    const meetNurse = dialogue[2];
    const fail = dialogue[3];
    const success = dialogue[4];
    const comment = dialogue[5];
    const roomInfo = dialogue[6];
    const enterLab = dialogue[7];
    const garbageHeart = dialogue[8];

    if (localStorage["Brain Scan"] === "A beautiful mind.") {
      meetNurse.hasAppeared = true;
      dialogueArea(480, 624, 264, 322, comment, this.player, this.message);
      dialogueArea(320, 400, 40, 100, success, this.player, this.message);
      dialogueArea(270, 295, 216, 220, roomInfo, this.player, this.message);
    } else if (
      localStorage["Brain Scan"] ===
      "Too blurry! The doctor can't interpret this."
    ) {
      dialogueArea(320, 400, 40, 100, fail, this.player, this.message);
    }

    dialogueArea(
      48,
      150,
      329,
      359,
      intro,
      this.player,
       this.message)
    );
    dialogueArea(
      270,
      295,
      216,
      220,
      meetNurse,
      this.player,
       this.message)
    );
    dialogueArea(
      400,
      485,
      70,
      98,
      meetDoctor,
      this.player,
       this.message)
    );
    dialogueArea(
      530,
      550,
      455,
      562,
      enterLab,
      this.player,
       this.message)
    );
    dialogueArea(
      495,
      520,
      472,
      480,
      garbageHeart,
      this.player,
       this.message)
    );
  }

  spawn() {
    if (localStorage["from"] === "overworld") {
      localStorage.removeItem("from");
      this.player = this.physics.add.sprite(105, 530, "player", "shady_back_1");
    } else if (localStorage["Brain Scan"] === "A beautiful mind.") {
      localStorage.removeItem("from");
      this.player = this.physics.add.sprite(349, 85, "player", "shady_left_1");
      // dialogue.forEach((textObj) => {
      //   textObj.hasAppeared = true;
      // });
      // dialogue[4].hasAppeared = false;
    } else if (
      localStorage["Brain Scan"] ===
      "Too blurry! The doctor can't interpret this."
    ) {
      localStorage.removeItem("from");
      this.player = this.physics.add.sprite(
        359.5,
        84,
        "player",
        "shady_left_1"
      );
    }
  }
}
