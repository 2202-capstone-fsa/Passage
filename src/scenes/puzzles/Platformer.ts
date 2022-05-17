import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("platformer");
  }

  preload() {
    this.load.atlas("player");
  }
}
