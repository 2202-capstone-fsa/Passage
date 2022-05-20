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
import data from "../../../public/tiles/home.json";

const homeExits = [{ x: 210, y: 273, name: "game" }];

const text = [
  {
    x: 0,
    y: 0,

    properties: [{
      name: "message",
      value: 
        ""
    }]
  }
]

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private message!: Phaser.GameObjects.Text;

  constructor() {
    super("home");
  }

  preload() {
    //loading building tilesets
    this.load.image("interior", "tiles/RPGW_HousesAndInt_v1.1/interiors.png");
    this.load.image("furniture", "tiles/RPGW_HousesAndInt_v1.1/furniture.png");
    this.load.image("note", "tiles/icons/individual/icon384.png");

    //Load data (collisions, etc) for the map.
    this.load.tilemapTiledJSON("home", "tiles/home.json");

    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    //Create tile sets
    const map = this.make.tilemap({ key: "home" });
    const interiorTileSet = map.addTilesetImage("interior", "interior");
    const furnitureTileSet = map.addTilesetImage("furniture", "furniture");
    const noteTileSet = map.addTilesetImage("note", "note");
    const homeTileSets = [interiorTileSet, furnitureTileSet, noteTileSet];
    //building layers
    map.createLayer("ground", homeTileSets);
    const wallsLayer = map.createLayer("walls", homeTileSets);
    const furnitureLayer = map.createLayer("furniture", homeTileSets);
    console.log("alkjdsfgj;lak jsdfg;lkja;slkdfj");
    //map.createLayer("object", noteTileSet);

    map.createFromObjects("object", { id: 1 });

    this.player = this.physics.add.sprite(152, 57, "player", "doc-walk-down-0");
    setPlayer(this.player);
    createAnims(this.anims);
    this.cameras.main.centerOn(152, 27);

    wallsLayer.setCollisionByProperty({ collides: true });
    furnitureLayer.setCollisionByProperty({ collides: true });

    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.player, furnitureLayer);
    //this.physics.add.collider(this.player, objectsLayer);

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
        console.log(this.player.x, this.player.y)
        this.message,
        this.player,
        data.layers[3].objects,
        this.sound.add("item")
      );
    }),
      // Hit shift to view Inventory.
      this.cursors.shift.on("down", () => {
        displayInventory(this.message, this.player);
      }),
      debugDraw(wallsLayer, this);
    debugDraw(furnitureLayer, this);
    //debugDraw(objectsLayer, this);
  }

  update(t: number, dt: number) {
    let nextToTarget = isItClose(this.player, homeExits);
    if (nextToTarget) {
      window.scrollTo(0, 0);
      localStorage.setItem("from", "home");
      this.scene.start(nextToTarget.name);
    }

    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    let speed = this.message.text ? 0 : 120;
    movePlayer(this.player, speed, this.cursors);
  }
}
