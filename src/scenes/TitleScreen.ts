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
  updateInventory,
} from "../utils/helper";
import data from "../../public/tiles/titlescreen.json";

export default class TitleScreen extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  constructor() {
    super("titlescreen");
  }

  preload() {
    //Load graphics of background
    this.load.image("atlantis", "tiles/cave/atlantis.png");

    this.load.tilemapTiledJSON("titlescreen", "tiles/titlescreen.json");

    //Load title
    this.load.image("title", "tiles/title.png");
  }

  create() {
    const map = this.make.tilemap({ key: "titlescreen" });
    console.log("In title");

    window.scrollTo(100, 100);

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

    const titleTileSet = map.addTilesetImage("Atlantis", "atlantis");

    //Create Layer
    const titleBackLayer = map.createLayer("Background", titleTileSet);

    const titleFrontLayer = map.createLayer("Foreground", titleTileSet);

    titleBackLayer;
    titleFrontLayer;

    //Create the title png
    const items = this.physics.add.staticGroup();
    items.create(240, 200, "title");

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

    this.add.text(240, 300, "Press Shift to Start", {}).setOrigin(0.5);

    this.input.keyboard.once(`keydown-SHIFT`, () => {
      this.scene.start("start");
    });
  }

  update() {}
}
