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
import data from "../../public/tiles/home.json";

const homeExits = [{ x: 210, y: 278, name: "game" }];

const dialogue = [
  {
    x: 152,
    y: 57,
    properties: [
      {
        name: "message",
        value:
          "What on Earth? Whose voice was that just now? Ergh, I must have drank too much last night. Damn it! I'm so hungry too.",
      },
    ],
    hasAppeared: false,
  },
  {
    properties: [
      {
        name: "message",
        value:
          "Alright, well that's more than a regular headache. What is this place? Feels like home.. but I don't recognize it. I should see my doctor. Doctor, uh.. whatshisname? Yeah, this ain't right.",
      },
    ],
    hasAppeared: false,
  },
  {
    properties: [
      {
        name: "message",
        value:
          "Empty plates, and no food around. I suppose I could stop at KFC before I head to the  doctor. Err, that doesn't sound right.",
      },
    ],
    hasAppeared: false,
  },
];

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
    const homeTileSets = [interiorTileSet, furnitureTileSet];

    //Building layers
    map.createLayer("ground", homeTileSets);
    const wallsLayer = map.createLayer("walls", homeTileSets);
    const furnitureLayer = map.createLayer("furniture", homeTileSets);
    //map.createLayer("object", noteTileSet);

    map.createFromObjects("object", { id: 1 });

    this.spawn();

    setPlayer(this.player);
    createAnims(this.anims);
    this.cameras.main.centerOn(152, 27);

    wallsLayer.setCollisionByProperty({ collides: true });
    furnitureLayer.setCollisionByProperty({ collides: true });

    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.player, furnitureLayer);
    //this.physics.add.collider(this.player, objectsLayer);

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
      interact(
        this.message,
        this.player,
        data.layers[2].objects,
        this.sound.add("item")
      );
    }),
      // Hit shift to view Inventory.
      this.cursors.shift.on("down", () => {
        displayInventory(this.message, this.player);
      });

    // debugDraw(wallsLayer, this);
    // debugDraw(furnitureLayer, this);
    // debugDraw(objectsLayer, this);
  }

  update(t: number, dt: number) {
    this.exits();
    this.playDialogue();

    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    let speed = this.message.text ? 0 : 120;
    movePlayer(this.player, speed, this.cursors);
  }

  exits() {
    let nextToTarget = isItClose(this.player, homeExits);
    if (nextToTarget) {
      localStorage.setItem("from", `home`);
      this.scene.stop("home");
      window.scrollTo(0, 0);
      this.scene.start(nextToTarget.name);
    }
  }

  playDialogue() {
    const movingAround = dialogue[1];
    const hungies = dialogue[2];

    if (this.player.y > 87 && !movingAround.hasAppeared) {
      if (this.message.text) this.message.text = "";

      //***
      //CRACKLING sound effect, and screen shake if possible.

      updateText(this.player, movingAround, this.message);
      movingAround.hasAppeared = true;
    }

    if (this.player.y > 217 && !hungies.hasAppeared) {
      if (this.message.text) this.message.text = "";

      updateText(this.player, hungies, this.message);
      hungies.hasAppeared = true;
    }

    let dialogueSpot = isItClose(this.player, dialogue);
    if (dialogueSpot && !dialogueSpot.hasAppeared) {
      if (this.message.text) this.message.text = "";
      updateText(this.player, dialogueSpot, this.message);
      dialogueSpot.hasAppeared = true;
    }
  }

  spawn() {
    if (localStorage["from"] === "overworld") {
      localStorage.removeItem("from");
      this.player = this.physics.add.sprite(
        207,
        255,
        "player",
        "doc-walk-up-0"
      );
    } else {
      this.player = this.physics.add.sprite(
        152,
        57,
        "player",
        "doc-walk-down-0"
      );
    }
  }
}
