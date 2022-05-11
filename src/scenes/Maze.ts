import Phaser from "phaser"
import { debugDraw } from "../utils/debug";


export default class Maze extends Phaser.Scene {
    private parry!: "string";
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private player!: Phaser.Physics.Arcade.Sprite;
  
    constructor() {
        super("maze")
    }
    preload() {
        //Load graphics for maze and player    
        this.load.image('shop', 'tiles/RPGW_HousesAndInt_v1.1/interiors.png');
        this.load.image('props', 'tiles/RPGW_HousesAndInt_v1.1/decorative_props.png');
        this.load.atlas(
          "player",
          "NPC_Characters_v1/Male4.png",
          "NPC_Characters_v1/MaleSprites.json"
        );
        //load audio
        this.load.audio("music", ["music/Chopin-Maze.mp3"]);
    
        //Load data (collisions, etc) for the map.
        this.load.tilemapTiledJSON("maze", "tiles/maze.json");
    
        //Load keyboard for player to use.
        this.cursors = this.input.keyboard.createCursorKeys();
      }
    
      create() {
        //Create tile sets so that we can access Tiled data later on.
        const map = this.make.tilemap({ key: "maze" });
        
        const mazeTileSet = map.addTilesetImage("house", "shop");
        const propsTileSet = map.addTilesetImage("props", "props");
    
        //Create ground layer first using tile set data.
        map.createLayer("subground", [mazeTileSet, propsTileSet]);
        const groundLayer = map.createLayer("ground", [mazeTileSet, propsTileSet]);
        
        
        /* Add Player sprite to the game.
          In the sprite json file, for any png of sprites,
          the first set of sprites is called "green"
          the second set is called "teal"
          the third set is called "brown"
          and the fourth set is called "doc"
        */
        //map.create
    
        this.player = this.physics.add.sprite(
          350,
          600,
          "player",
          "doc-walk-down-0"
        );
        this.player.body.setSize(this.player.width * .1, this.player.height * .1);
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

                // this.cameras.main.startFollow(this.player, true);
        // this.cameras.main.setBounds(0, 0, 1600, 1600);
        // this.cameras.main.centerOn(600, 600);
    
        //Create houses and walls in this world, over the Ground and Player.
        const wallsLayer =  map.createLayer("walls", [mazeTileSet, propsTileSet]);
    
        //Set walls and houses to collide with Player.
        wallsLayer.setCollisionByProperty({ collides: true });
        groundLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, wallsLayer);

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
    
        debugDraw(wallsLayer, this);
      }
    
      update(t: number, dt: number) {
        if (!this.cursors || !this.player) {
          return;
        }
    
        this.cameras.main.scrollX = this.player.x - 120;
        this.cameras.main.scrollY = this.player.y - 70;
    
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