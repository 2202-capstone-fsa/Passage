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
import data from "../../public/tiles/maze.json";

const mazeExits = [
  { x: 580, y: 73, name: "shop" },
  { x: 82, y: 1480, name: "shop" },
];

const dialogue = [
  {
    x: 130,
    y: 1482,
    properties: [
      {
        name: "message",
        value:
          "How on Earth did I end up here? I.. am still on Earth, right? I should be able to find the owner of the house by following this hallway down.",
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
        value:
          "Heavens. How many turns does this wallway have? And not a poster or window in sight! I wouldn't be surprised if this was the guy's dungeon and I found a prisoner in here! Hahaha. Actually, that's kind of scary. Onward.",
      },
    ],
    hasAppeared: false,
  },
  {
    properties: [
      {
        name: "message",
        value:
          "This house looks familiar. All the furniture is gone, though. Maybe the guy who lived here moved away. Er.. what am I thinking? As if some guy lived in the middle of this awful maze.",
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

const text = [
  
]

export default class Game extends Phaser.Scene {
  private parry!: "string";
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private message!: Phaser.GameObjects.Text;

  constructor() {
    super("maze");
  }

  preload() {
    //Load graphics for maze and player
    this.load.image("building", "tiles/RPGW_HousesAndInt_v1.1/interiors.png");
    this.load.image("props", "tiles/RPGW_HousesAndInt_v1.1/decorative_props.png");
    this.load.image("furniture", "tiles/RPGW_HousesAndInt_v1.1/furniture.png");
    this.load.image("objects", "tiles/icons/icons.png");

    //Load data (collisions, etc) for the map.
    this.load.tilemapTiledJSON("maze", "tiles/maze.json");

    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    //Create tile sets so that we can access Tiled data later on.
    const map = this.make.tilemap({ key: "maze" });
    const buildingTileSet = map.addTilesetImage("Building", "building");
    const mazeTileSet = map.addTilesetImage("house", "building");
    const furnitureTileSet = map.addTilesetImage("Furniture", "furniture");
    const propsTileSet = map.addTilesetImage("props", "props");
    const allTileSets = [
      buildingTileSet,
      mazeTileSet,
      furnitureTileSet,
      propsTileSet,
    ];

    //Create ground layer first using tile set data.
    map.createLayer("subground", allTileSets);
    map.createLayer("ground", allTileSets);
    const wallsLayer = map.createLayer("walls", allTileSets);
    const furnitureLayer = map.createLayer("furniture", allTileSets);

    this.player = this.physics.add.sprite(
      130,
      1482,
      // 494, End of maze for dev.
      // 73,
      "player",
      "doc-walk-side-0"
    );
    setPlayer(this.player);
    createAnims(this.anims);

    wallsLayer.setCollisionByProperty({ collides: true });
    furnitureLayer.setCollisionByProperty({ collides: true });

    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.player, furnitureLayer);

    let music = this.sound.add("race");
    let musicConfig = {
      mute: false,
      volume: 0.5,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    };
    music.play(musicConfig);

    this.message = this.add.text(800, 750, "", {
      color: "white",
      backgroundColor: "black",
      fontSize: "12px",
      align: "center",
      baselineX: 0,
      baselineY: 0,
      wordWrap: { width: 250 },
    });

    // Hit spacebar to interact with objects.
    this.cursors.space.on("down", () => {
      console.log(data);
      interact(
        this.message,
        this.player,
        data.layers[4].objects,
        this.sound.add("item")
      );
    }),
      // Hit shift to view Inventory.
      this.cursors.shift.on("down", () => {
        displayInventory(this.message, this.player);
      });

    // debugDraw(wallsLayer, this);
    // debugDraw(furnitureLayer, this);
    // debugDraw(lowObjLayer, this);
  }

  update(t: number, dt: number) {
    this.exits();
    this.playDialogue();

    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    let speed = this.message.text ? 0 : 200;
    movePlayer(this.player, speed, this.cursors);
  }

  exits() {
    let nextToTarget = isItClose(this.player, mazeExits);
    if (nextToTarget) {
      if (this.player.y < 500) {
        localStorage.setItem("from", `mazeWin`);
      } else {
        localStorage.setItem("from", `mazeFail`);
      }

      this.scene.stop("maze");
      this.scene.start(nextToTarget.name);
    }
  }

  playDialogue() {
    const firstWrongTurn = dialogue[1];
    const secondWrongTurn = dialogue[2];
    const thirdWrongTurn = dialogue[3];
    const choicePath = dialogue[4];
    const enteringHouse = dialogue[5];
    const leavingMaze = dialogue[6];

    dialogueArea(130, 190, 0, 1160, firstWrongTurn, this.player, this.message);
    dialogueArea(
      800,
      930,
      1016,
      1041,
      secondWrongTurn,
      this.player,
      this.message
    );
    dialogueArea(550, 687, 625, 700, thirdWrongTurn, this.player, this.message);
    dialogueArea(495, 615, 1399, 1410, choicePath, this.player, this.message);
    dialogueArea(875, 940, 480, 660, enteringHouse, this.player, this.message);
    dialogueArea(494, 500, 72, 97, leavingMaze, this.player, this.message);

    let dialogueSpot = isItClose(this.player, dialogue);
    if (dialogueSpot && !dialogueSpot.hasAppeared) {
      if (this.message.text) this.message.text = "";
      updateText(this.player, dialogueSpot, this.message);
      dialogueSpot.hasAppeared = true;
    }
  }
}
