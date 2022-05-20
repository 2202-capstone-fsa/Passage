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
import data from "../../../public/tiles/maze.json";

const mazeExits = [{ x: 580, y: 73, name: "shop" }];

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

    /* Add Player sprite to the game.
          In the sprite json file, for any png of sprites,
          the first set of sprites is called "green"
          the second set is called "teal"
          the third set is called "brown"
          and the fourth set is called "doc"
        */
    //map.create

    this.player = this.physics.add.sprite(
      120,
      1480,
      "player",
      "doc-walk-down-0"
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
      }),
      debugDraw(wallsLayer, this);
    debugDraw(furnitureLayer, this);
    //debugDraw(lowObjLayer, this);
  }

  update(t: number, dt: number) {
    let nextToTarget = isItClose(this.player, mazeExits);
    if (nextToTarget) {
      localStorage.setItem("from", `maze`);
      this.scene.stop("maze");
      this.scene.start(nextToTarget.name);
    }

    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    let speed = this.message.text ? 0 : 200;
    movePlayer(this.player, speed, this.cursors);
  }
}
