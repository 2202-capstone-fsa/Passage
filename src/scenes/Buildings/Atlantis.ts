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

const atlantisExits = [{ x: 235, y: 449, name: "game" }];

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private message!: Phaser.GameObjects.Text;

  constructor() {
    super("atlantis");
  }

  preload() {
    //Load graphics for atlantis.
    this.load.image("icons", "tiles/icons/icons.png");
    this.load.image("building", "tiles/cave/atlantis.png");

    this.load.tilemapTiledJSON("atlantis", "tiles/atlantis.json");

    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    //Create tile sets so that we can access Tiled data later on.
    const map = this.make.tilemap({ key: "atlantis" });
    console.log("In atlantis");
    const buildingTileSet = map.addTilesetImage("Atlantis", "building");
    const iconsTileSet = map.addTilesetImage("Icons", "icons");
    const atlantisTilesets = [buildingTileSet, iconsTileSet];

    //Create ground layer first using tile set data.
    const groundLayer = map.createLayer("Ground", atlantisTilesets);
    const wallLayer = map.createLayer("Walls", atlantisTilesets);
    const objLayer = map.createLayer("Objects", atlantisTilesets);
    //const objectLayer = map.createLayer("objects", atlantisTilesets);

    localStorage.removeItem("from");
    this.player = this.physics.add.sprite(
      250,
      400,
      "player",
      "doc-walk-down-0"
    );

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
  }

  update(t: number, dt: number) {
    let nextToTarget = isItClose(this.player, atlantisExits);
    if (nextToTarget) {
      localStorage.setItem("from", `atlantis`);
      this.scene.stop("atlantis");
      this.scene.start(nextToTarget.name);
    }
    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    const speed = this.message.text ? 0 : 120;
    movePlayer(this.player, speed, this.cursors);
  }
}
