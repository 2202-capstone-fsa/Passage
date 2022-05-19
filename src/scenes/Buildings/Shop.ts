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
} from "../../utils/helper";
import { debugDraw } from "../../utils/debug";
import data from "../../../public/tiles/craftsman.json";

const shopExits = [
  { x: 718, y: 552, name: "maze" },
  { x: 574, y: 72, name: "shop" },
  { x: 356, y: 449, name: "game" },
];

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private message!: Phaser.GameObjects.Text;

  constructor() {
    super("shop");
  }

  preload() {
    this.load.image("shop", "tiles/RPGW_HousesAndInt_v1.1/interiors.png");
    this.load.image(
      "props",
      "tiles/RPGW_HousesAndInt_v1.1/decorative_props.png"
    );
    this.load.image("decore", "tiles/RPGW_HousesAndInt_v1.1/furniture.png");

    //Load data (collisions, etc) for the map.
    this.load.tilemapTiledJSON("craftsman", "tiles/craftsman.json");

    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    //Create tile sets
    const map = this.make.tilemap({ key: "craftsman" });
    const crafthouseTileSet = map.addTilesetImage("crafthouse", "shop");
    const decorationsTileSet = map.addTilesetImage("decorations", "decore");
    const propsTileSet = map.addTilesetImage("props", "props");
    const shopTileSets = [crafthouseTileSet, decorationsTileSet, propsTileSet];
    //building layers
    map.createLayer("black", crafthouseTileSet);
    map.createLayer("ground", crafthouseTileSet);
    const wallsLayer = map.createLayer("walls", shopTileSets);
    const decoreLayer = map.createLayer("decore", shopTileSets);
    const decorationsLayer = map.createLayer("decorations", shopTileSets);
    //const decoreLayer = map.createLayer('decore', shopTileSet);

    if (localStorage["from"] === "maze") {
      localStorage.removeItem("from");
      let doors = [
        [418, 159],
        [194, 159],
        [684, 157],
      ];
      let chanceDoor = doors[Math.floor(Math.random() * doors.length)];
      this.player = this.physics.add.sprite(
        chanceDoor[0],
        chanceDoor[1],
        "player",
        "doc-walk-down-0"
      );
    } else {
      localStorage.removeItem("from");
      this.player = this.physics.add.sprite(
        350,
        420,
        "player",
        "doc-walk-up-0"
      );
    }
    setPlayer(this.player);
    createAnims(this.anims);

    //adds collisions
    wallsLayer.setCollisionByProperty({ collides: true });
    decoreLayer.setCollisionByProperty({ collides: true });
    decorationsLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.player, decoreLayer);
    this.physics.add.collider(this.player, decorationsLayer);

    // let music = this.sound.add("music");
    // let musicConfig = {
    //   mute: false,
    //   volume: 0.5,
    //   rate: 1,
    //   detune: 0,
    //   seek: 0,
    //   loop: true,
    //   delay: 0,
    // };
    // music.play(musicConfig);

    this.message = this.add.text(800, 750, "", {
      color: "white",
      backgroundColor: "black",
      fontSize: "12px",
      align: "center",
      baselineX: 0,
      baselineY: 0,
      wordWrap: { width: 250 },
    });
    this.sound.add("item");

    // Hit spacebar to interact with objects.
    this.cursors.space.on("down", () => {
      console.log(data);
      interact(
        this.message,
        this.player,
        data.layers[5].objects,
        this.sound.add("item")
      );
    }),
      // Hit shift to view Inventory.
      this.cursors.shift.on("down", () => {
        displayInventory(this.message, this.player);
      }),
      debugDraw(wallsLayer, this);
    debugDraw(decoreLayer, this);
    debugDraw(decorationsLayer, this);
  }

  update(t: number, dt: number) {
    let nextToTarget = isItClose(this.player, shopExits);
    if (nextToTarget) {
      localStorage.setItem("from", `shop`);
      this.scene.stop("shop");
      this.scene.start(nextToTarget.name);
    }

    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    let speed = this.message.text ? 0 : 120;
    movePlayer(this.player, speed, this.cursors);
  }
}
