import Phaser from "phaser";
import {
  isItClose,
  setPlayer,
  movePlayer,
  overworldExits,
  overworldObjs,
  createAnims,
  interact,
} from "../../utils/helper";
import { debugDraw } from "../../utils/debug";
import data from "../../../public/tiles/atlantis.json";

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

    //Load the item
    this.load.image("heart", "tiles/icons/individual/icon001.png");
    this.load.image("soul", "tiles/icons/individual/icon130.png");

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

    //add the static item
    // const heart = this.physics.add.staticImage(200, 465, "heart");
    const items = this.physics.add.staticGroup();
    items.create(205, 350, "heart");
    items.create(275, 350, "soul");

    this.player = this.physics.add.sprite(
      250,
      400,
      "player",
      "doc-walk-down-0"
    );
    this.player.body.setSize(this.player.width * 0.3, this.player.height * 0.2);
    this.player.body.setOffset(6.5, 30);
    this.player.setCollideWorldBounds(true);

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

    //Collides
    this.physics.add.collider(this.player, items);
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

    // Hit spacebar to interact with objects.
    this.cursors.space.on("down", () => {
      console.log(data);
      interact(this.message, this.player, data.layers[4].objects);
    });
    debugDraw(wallLayer, this);
    debugDraw(groundLayer, this);
  }

  update() {
    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

    const speed = this.message.text ? 0 : 120;
    if (this.cursors.left?.isDown) {
      this.player.anims.play("player-walk-side", true);
      this.player.setVelocity(-speed, 0);
      this.player.scaleX = 1;
      this.player.body.offset.x = 5;
      //console.log(data);
    } else if (this.cursors.right?.isDown) {
      this.player.anims.play("player-walk-side", true);
      this.player.setVelocity(speed, 0);
      this.player.scaleX = -1;
      this.player.body.offset.x = 10;
    } else if (this.cursors.down?.isDown) {
      this.player.anims.play("player-walk-down", true);
      this.player.setVelocity(0, speed);
      this.player.body.offset.y = 25;
    } else if (this.cursors.up?.isDown) {
      this.player.anims.play("player-walk-up", true);
      this.player.setVelocity(0, -speed);
      this.player.body.offset.y = 25;
    } else {
      if (!this.player.anims.currentAnim) return;
      const parts = this.player.anims.currentAnim.key.split("-");
      parts[1] = "idle";
      this.player.play(parts.join("-"));
      this.player.setVelocity(0, 0);
    }
  }
}