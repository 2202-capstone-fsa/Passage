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
} from "../../utils/helper";
import data from "../../../public/tiles/atlantis.json";

const dialogue = [
  {
    x: 250,
    y: 400,
    properties: [
      {
        name: "message",
        value:
          "A secret cave! You're always supposed to go behind the waterfall! Haha! I.. wish someone was here to share this moment with me. What can I do here, anyway?",
      },
    ],
    hasAppeared: false,
  },
  {
    properties: [
      {
        name: "message",
        value:
          "I could always go for a little treasure hunt. One dubloon in my pocket, and I'll be the richest man in the world! Normal man, at least.",
      },
    ],
    hasAppeared: false,
  },
  {
    properties: [
      {
        name: "message",
        value: `Her voice again: "This pearl necklace is all I have of him. As long as I have this, his spirit will always be with me."`,
      },
    ],
    hasAppeared: false,
  },
  {
    properties: [
      {
        name: "message",
        value: `Oh boy a shovel!"`,
      },
    ],
    hasAppeared: false,
  },
];

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private message!: Phaser.GameObjects.Text;
  private objLayer!: Phaser.Tilemaps.ObjectLayer;
  private waterfall!: Phaser.sound;

  constructor() {
    super("atlantis");
  }

  preload() {
    //Load graphics for atlantis map.
    this.load.image("icons", "tiles/icons/icons.png");
    this.load.image("cave", "tiles/cave/atlantis.png");
    this.load.tilemapTiledJSON("atlantis", "tiles/atlantis.json");

    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.cameras.main.setSize(575.5, 550.5);

    //Create tile sets so that we can access Tiled data later on.
    const map = this.make.tilemap({ key: "atlantis" });
    const buildingTileSet = map.addTilesetImage("Atlantis", "cave");
    const iconsTileSet = map.addTilesetImage("Icons", "icons");
    const atlantisTilesets = [buildingTileSet, iconsTileSet];

    //Create ground layer first using tile set data.
    const groundLayer = map.createLayer("Ground", atlantisTilesets);
    const wallLayer = map.createLayer("Walls", atlantisTilesets);
    const objLayer = map.createLayer("Objects", atlantisTilesets);

    //Remove token from the overworld and spawn player.
    localStorage.removeItem("from");
    this.player = this.physics.add.sprite(238, 400, "player", "shady_back_1");
    setPlayer(this.player);
    createAnims(this.anims);

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
    let item = this.sound.add("item");
    this.waterfall = this.sound.add("waterfall");
    let musicConfig = {
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
    this.cursors.space.on("down", () => {
      interact(0.03, this.message, this.player, data.layers[3].objects, item);
    });
    // Hit shift to view Inventory.
    this.cursors.shift.on("down", () => {
      return displayInventory(this.message, this.player);
    }),
      this.cameras.main.startFollow(this.player);
  }

  update(t: number, dt: number) {
    this.exits();
    this.playDialogue();
    this.grabItems();

    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    const speed = this.message.text ? 0 : 120;
    movePlayer(this.player, speed, this.cursors);
  }

  exits() {
    if (this.player.y > 428) {
      localStorage.setItem("from", `atlantis`);
      this.waterfall.stop();
      this.scene.stop("atlantis");
      this.scene.start("game");
    }
  }

  playDialogue() {
    const midwayPoint = dialogue[1];
    const grabSoul = dialogue[2];
    const grabShovel = dialogue[3];

    //Where is the shovel?

    dialogueArea(192, 287, 9, 59, grabSoul, this.player, this.message);
    dialogueArea(
      96,
      142,
      302,
      337,
      grabShovel,
      this.player,
       this.message)
    );

    if (this.player.y < 176 && !midwayPoint.hasAppeared) {
      if (this.message.text) this.message.text = "";
      updateText(this.player, midwayPoint, this.message);
      midwayPoint.hasAppeared = true;
    }

    let dialogueSpot = isItClose(0.03, this.player, dialogue);
    if (dialogueSpot && !dialogueSpot.hasAppeared) {
      if (this.message.text) this.message.text = "";
      updateText(this.player, dialogueSpot, this.message);
      dialogueSpot.hasAppeared = true;
    }
  }

  grabItems() {
    if (
      this.player.x > 192 &&
      this.player.x < 287 &&
      this.player.y < 50 &&
      !localStorage["Soul"]
    ) {
      this.sound.play("item");
      localStorage.setItem("Soul", `Apparently this is my soul.`);
    }
    if (
      this.player.x > 96 &&
      this.player.x < 142 &&
      this.player.y > 302 &&
      !localStorage["Shovel"]
    ) {
      this.sound.play("item");
      localStorage.setItem("Shovel", "Memories of the beach.");
    }
  }
}
