import Phaser from "phaser";
import { debugDraw } from "../../utils/debug";

export default class Shop extends Phaser.Scene {
  private parry!: "string";
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;

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
    this.load.atlas(
      "player",
      "NPC_Characters_v1/Male4.png",
      "NPC_Characters_v1/MaleSprites.json"
    );

    //load audio
    this.load.audio("music", ["music/2.mp3"]);
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
    //building layers
    map.createLayer("black", crafthouseTileSet);
    map.createLayer("ground", crafthouseTileSet);
    const wallsLayer = map.createLayer("walls", [
      crafthouseTileSet,
      decorationsTileSet,
      propsTileSet,
    ]);
    const decoreLayer = map.createLayer("decore", [
      crafthouseTileSet,
      decorationsTileSet,
      propsTileSet,
    ]);
    const decorationsLayer = map.createLayer("decorations", [
      decorationsTileSet,
      propsTileSet,
    ]);
    //const decoreLayer = map.createLayer('decore', shopTileSet);

    this.player = this.physics.add.sprite(
      340,
      450,
      "player",
      "doc-walk-down-0"
    );
    this.player.body.setSize(this.player.width * 0.1, this.player.height * 0.1);
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

    //adds collisions
    wallsLayer.setCollisionByProperty({ collides: true });
    decoreLayer.setCollisionByProperty({ collides: true });
    decorationsLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, [
      wallsLayer,
      decoreLayer,
      decorationsLayer,
    ]);
  }
  update(t: number, dt: number) {
    if (!this.cursors || !this.player) {
      return;
    }

    this.cameras.main.scrollX = this.player.x - 400;
    this.cameras.main.scrollY = this.player.y - 300;

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
