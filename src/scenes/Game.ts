import Phaser from "phaser";
import { debugDraw } from "../utils/debug";
import testhouse from "./Buildings/testhouse";
import data from "../../public/tiles/overworld.json";
import { isItClose } from "../helper";

export default class Game extends Phaser.Scene {
  private parry!: "string";
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super("game");
    console.log(data);
  }

  preload() {
    //Load graphics
    this.load.image("houses", "tiles/overworld/houses.png");
    this.load.image("outside", "tiles/overworld/outside.png");
    this.load.image("jungle", "tiles/overworld/jungle.png");
    this.load.image("beach", "tiles/overworld/beach.png");
    this.load.image("clouds", "tiles/overworld/clouds.png");

    //Load player
    this.load.atlas(
      "player",
      "NPC_Characters_v1/Male4.png",
      "NPC_Characters_v1/MaleSprites.json"
    );

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
    this.player.body.setSize(this.player.width * 1, this.player.height * 1);
    this.player.setCollideWorldBounds(true);

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

    // text demo that changes on spacebar press
    const message = this.add.text(800, 750, "", {
      color: "white",
      backgroundColor: "black",
      fontSize: "12px",
      align: "center",
      baselineX: 0,
      baselineY: 0,
      wordWrap: { width: 250 },
    });

    this.cursors.space.on("down", () => {
      let x = this.player.x;
      let y = this.player.y;
      console.log(x);
      console.log(y);
      if (message.text) {
        message.text = "";
        message.y = y + 160;
        message.x = x;
      } else if (x > 509 && x < 522 && y > 857 && y < 935) {
        // lamp
        message.y = y + 160;
        message.x = x;
        message.text =
          "This lamp is glowing faintly. Theres's no flame and no bulb. It's an empty, indecernable light source";
      } else if (x > 170 && x < 195 && y > 620 && y < 634) {
        // enter house 1
        this.scene.start(new testhouse());
        // this.scene.transition({
        //   target: "testhouse",
        //   duration: 1000,
        // });
      } else {
        console.log("test");
      }
    });

    // debugDraw(wallsLayer, this);
  }

  update(t: number, dt: number) {
    if (!this.cursors || !this.player) {
      return;
    }
    let aboutToEnter = isItClose(this.player, data.layers);
    // Walking, check for entering scene
    if (aboutToEnter) {
      let targetScene = aboutToEnter.name;
      this.scene.start(targetScene);
    }

    // let x = this.player.x;
    // let y = this.player.y;
    // if (x > 170 && x < 195 && y > 620 && y < 634) {
    //   // enter house 1
    //   this.scene.start(new testhouse());
    // }

    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    // movement
    const speed = 120;
    if (this.cursors.left?.isDown) {
      this.player.anims.play("player-walk-side", true);
      this.player.setVelocity(-speed, 0);
      this.player.scaleX = 1;
      this.player.body.offset.x = 0;
    } else if (this.cursors.right?.isDown) {
      this.player.anims.play("player-walk-side", true);
      this.player.setVelocity(speed, 0);
      this.player.scaleX = -1;
      this.player.body.offset.x = 16;
    } else if (this.cursors.down?.isDown) {
      this.player.anims.play("player-walk-down", true);
      this.player.setVelocity(0, speed);
      this.player.body.offset.y = 0;
    } else if (this.cursors.up?.isDown) {
      this.player.anims.play("player-walk-up", true);
      this.player.setVelocity(0, -speed);
      this.player.body.offset.y = 0;
    } else {
      if (!this.player.anims.currentAnim) return;
      const parts = this.player.anims.currentAnim.key.split("-");
      parts[1] = "idle";
      this.player.play(parts.join("-"));
      this.player.setVelocity(0, 0);
    }
  }
}
