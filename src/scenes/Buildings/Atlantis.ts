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
} from "../../utils/helper";
import { debugDraw } from "../../utils/debug";
import data from "../../../public/tiles/atlantis.json";

//const atlantisExits = [{ x: 235, y: 449, name: "game" }];

const dialogue = [
  {
    x: 250,
    y: 400,
    properties: [
      {
        name: "message",
        value: "Am I underwater? I feel so.. lonely. What can I do here?",
      },
    ],
  },
];

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private message!: Phaser.GameObjects.Text;

  constructor() {
    super("atlantis");
  }

  preload() {
    //Load graphics for atlantis map.
    this.load.image("icons", "tiles/icons/icons.png");
    this.load.image("building", "tiles/cave/atlantis.png");
    this.load.tilemapTiledJSON("atlantis", "tiles/atlantis.json");

    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.cameras.main.setSize(475, 300);

    //Create tile sets so that we can access Tiled data later on.
    const map = this.make.tilemap({ key: "atlantis" });
    const buildingTileSet = map.addTilesetImage("Atlantis", "building");
    const iconsTileSet = map.addTilesetImage("Icons", "icons");
    const atlantisTilesets = [buildingTileSet, iconsTileSet];

    //Create ground layer first using tile set data.
    const groundLayer = map.createLayer("Ground", atlantisTilesets);
    const wallLayer = map.createLayer("Walls", atlantisTilesets);
    const objLayer = map.createLayer("Objects", atlantisTilesets);

    localStorage.removeItem("from");
    this.player = this.physics.add.sprite(250, 400, "player", "doc-walk-up-0");

    setPlayer(this.player);
    createAnims(this.anims);

    //Collides
    wallLayer.setCollisionByProperty({ collides: true });
    objLayer.setCollisionByProperty({ collides: true });
    groundLayer.setCollisionByProperty({ collides: true });

    this.physics.add.collider(this.player, groundLayer);
    this.physics.add.collider(this.player, wallLayer);
    this.physics.add.collider(this.player, objLayer);

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
    let waterfall = this.sound.add("waterfall");
    let musicConfig = {
      mute: false,
      volume: 0.02,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 1,
    };
    waterfall.play(musicConfig);

    // Hit spacebar to interact with objects.
    this.cursors.space.on("down", () => {
      console.log(data);
      console.log(displayInventory);
      interact(
        this.message,
        this.player,
        data.layers[3].objects,
        this.sound.add("item")
      );
    });
    // Hit shift to view Inventory.
    this.cursors.shift.on("down", () => {
      return displayInventory(this.message, this.player);
    }),
      debugDraw(wallLayer, this);
    debugDraw(groundLayer, this);
    this.cameras.main.startFollow(this.player);
  }

  update(t: number, dt: number) {
    this.exits();
    this.playDialogue();

    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    const speed = this.message.text ? 0 : 120;
    movePlayer(this.player, speed, this.cursors);
  }

  exits() {
    if (this.player.y > 449) {
      localStorage.setItem("from", `atlantis`);
      this.scene.stop("atlantis");
      this.scene.start("game");
    }
  }

  playDialogue() {
    let dialogueSpot = isItClose(this.player, dialogue);
    if (dialogueSpot && !dialogueSpot.hasAppeared) {
      if (this.message.text) this.message.text = "";
      updateText(this.player, dialogueSpot, this.message);
      dialogueSpot.hasAppeared = true;
    }
  }
}
