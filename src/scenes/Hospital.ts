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
  { x: 105, y: 575, name: "game" },
  { x: 635, y: 52, name: "shop" },
];

const dialogue = [
  {
    x: 105,
    y: 384,
    properties: [{ name: "message", value: "THis hospoital is caa" }],
    hasAppeared: false,
  },
  // {x: , y: , message: "", hasAppeared: false},
  // {x: , y: , message: "", hasAppeared: false},
];

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private message!: Phaser.GameObjects.Text;

  constructor() {
    super("hospital");
  }

  preload() {
    //Load graphics for hospital.
    this.load.image("items", "tiles/LabItems.png");
    this.load.image("building", "tiles/ModernTiles.png");

    this.load.tilemapTiledJSON("hospital", "tiles/hospital.json");

    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    //Create tile sets so that we can access Tiled data later on.

    const map = this.make.tilemap({ key: "hospital" });
    console.log("In hospital");
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
    map.createFromObjects("objects", { id: 10 });
    map.createFromObjects("objects", { id: 341 });

    //Add if statement depending on if Pong is complete.
    this.player = this.physics.add.sprite(
      105,
      530,
      "player",
      "doc-walk-down-0"
    );

    setPlayer(this.player);
    createAnims(this.anims);

    floorLayer.setCollisionByProperty({ collides: true });
    floorObjLayer.setCollisionByProperty({ collides: true });
    lowObjLayer.setCollisionByProperty({ collides: true });
    highObjLayer.setCollisionByProperty({ collides: true });

    this.physics.add.collider(this.player, lowObjLayer);
    this.physics.add.collider(this.player, highObjLayer);
    this.physics.add.collider(this.player, floorLayer);
    this.physics.add.collider(this.player, floorObjLayer);

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
    let nextToTarget = isItClose(this.player, hospitalExits);
    if (nextToTarget) {
      this.scene.stop("hospital");
      this.scene.start(nextToTarget.name);
    }

    let closeToDialogueObj = isItClose(this.player, dialogue);
    if (closeToDialogueObj && !closeToDialogueObj.hasAppeared) {
      console.log("close to obj");
      if (this.message.text) this.message.text = "";
      else {
        console.log("updating");
        updateText(this.player, closeToDialogueObj, this.message);
        closeToDialogueObj.hasAppeared = true;
        // let i = 1;
        // localStorage.setItem(`taken${i}`, closeToDialogueObj);
        // console.log(localStorage);
        // i++;
      }
    }

    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    let speed = this.message.text ? 0 : 120;
    movePlayer(this.player, speed, this.cursors);
  }
}
