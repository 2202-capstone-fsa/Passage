import Phaser from "phaser";
import { debugDraw } from "../utils/debug";
import testhouse from "./Buildings/testhouse";
//import data from "../tiles/overworld.json";
import {
  isItClose,
  updateText,
  setPlayer,
  movePlayer,
  overworldScenes,
  overworldObjs,
  interact,
} from "../utils/helper";

export default class Game extends Phaser.Scene {
  private parry!: "string";
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private message!: Phaser.GameObjects.Text;

  constructor() {
    super("game");
  }

  preload() {
    //Load graphics
    this.load.image("houses", "tiles/overworld/houses.png");
    this.load.image("outside", "tiles/overworld/outside.png");
    this.load.image("jungle", "tiles/overworld/jungle.png");
    this.load.image("beach", "tiles/overworld/beach.png");
    this.load.image("clouds", "tiles/overworld/clouds.png");

    //Load audio
    this.load.audio("music", ["music/2.mp3"]);

    //Load data (collisions, etc) for the map.
    this.load.tilemapTiledJSON("overworld", "tiles/overworld.json");

    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    //Create tile sets so that we can access Tiled data later on.
    const map = this.make.tilemap({ key: "overworld" });
    const townTileSet = map.addTilesetImage("Town", "outside");
    const houseTileSet = map.addTilesetImage("Houses", "houses");
    const jungleTileSet = map.addTilesetImage("Jungle", "jungle");
    const beachTileSet = map.addTilesetImage("Beach", "beach");
    const cloudsTileSet = map.addTilesetImage("Clouds", "clouds");

    //Create ground layer first using tile set data.
    const overworld = map.addTilesetImage("overworld", "Ground");
    const groundLayer = map.createLayer("Ground", [
      houseTileSet,
      townTileSet,
      beachTileSet,
      jungleTileSet,
      cloudsTileSet,
    ]);

    const waterfallLayer = map.createLayer("Waterfall", [
      houseTileSet,
      townTileSet,
      beachTileSet,
      jungleTileSet,
      cloudsTileSet,
    ]);

    /* Add Player sprite to the game.
      In the sprite json file, for any png of sprites,
      the first set of sprites is called "green"
      the second set is called "teal"
      the third set is called "brown"
      and the fourth set is called "doc"
    */
    //map.create

    this.player = this.physics.add.sprite(
      800,
      800,
      "player",
      "doc-walk-down-0"
    );
    setPlayer(this.player);

    //adds and configs music
    let music = this.sound.add("music");
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

    //Create idle animations for direction player is facing.
    this.anims.create({
      key: "player-idle-down",
      frames: [{ key: "player", frame: "doc-walk-down-0" }],
    });
    this.anims.create({
      key: "player-idle-side",
      frames: [{ key: "player", frame: "doc-walk-side-0" }],
    });
    this.anims.create({
      key: "player-idle-up",
      frames: [{ key: "player", frame: "doc-walk-up-0" }],
    });

    //Create animations for player motions.
    this.anims.create({
      key: "player-walk-down",
      frames: this.anims.generateFrameNames("player", {
        start: 3,
        end: 6,
        prefix: "doc-walk-down-",
      }),
      repeat: -1,
      frameRate: 6,
    });

    this.anims.create({
      key: "player-walk-up",
      frames: this.anims.generateFrameNames("player", {
        start: 3,
        end: 6,
        prefix: "doc-walk-up-",
      }),
      repeat: -1,
      frameRate: 6,
    });

    this.anims.create({
      key: "player-walk-side",
      frames: this.anims.generateFrameNames("player", {
        start: 3,
        end: 6,
        prefix: "doc-walk-side-",
      }),
      repeat: -1,
      frameRate: 6,
    });

    //Create houses and walls in this world, over the Ground and Player.
    const housesLayer = map.createLayer("Houses", [
      houseTileSet,
      townTileSet,
      beachTileSet,
      jungleTileSet,
      cloudsTileSet,
    ]);
    const wallsLayer = map.createLayer("Walls", [
      houseTileSet,
      townTileSet,
      beachTileSet,
      jungleTileSet,
      cloudsTileSet,
    ]);

    // this.cameras.main.startFollow(this.player, true);
    // this.cameras.main.setBounds(0, 0, 1600, 1600);
    // this.cameras.main.centerOn(600, 600);

    //Set walls and houses to collide with Player.
    wallsLayer.setCollisionByProperty({ collides: true });
    housesLayer.setCollisionByProperty({ collides: true });
    waterfallLayer.setCollisionByProperty({ collides: true });

    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.player, housesLayer);
    this.physics.add.collider(this.player, waterfallLayer);

    // Array of interactable objects

    this.message = this.add.text(800, 750, "", {
      color: "white",
      backgroundColor: "black",
      fontSize: "12px",
      align: "center",
      baselineX: 0,
      baselineY: 0,
      wordWrap: { width: 250 },
    });

    // Hit spacebar to interact with objects. Clear message if there is one. Check if next to object and display text
    //interact(this.cursors, this.message, this.player);
    this.cursors.space.on("down", () => {
      interact(this.cursors, this.message, this.player);
      // console.log(this.player.x);
      // console.log(this.player.y);
      // if (this.message.text) {
      //   this.message.text = "";
      // } else {
      //   let nextToTarget = isItClose(this.player, []);
      //   console.log(nextToTarget);
      //   if (nextToTarget) {
      //     console.log(`im next to ${nextToTarget.name}`);
      //     updateText(this.player, nextToTarget, this.message);
      //   }
      // }
    }),
      debugDraw(wallsLayer, this);
  }

  update(t: number, dt: number) {
    if (!this.cursors || !this.player) {
      return;
    }

    // Enter a scene when near
    let nextToTarget = isItClose(this.player, overworldScenes);
    if (nextToTarget) {
      this.scene.start(nextToTarget.name);
    }

    // Camera that follows
    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    // movement
    let speed = this.message.text ? 0 : 120;
    movePlayer(this.player, speed, this.cursors);
  }
}
