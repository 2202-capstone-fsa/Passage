import Phaser from "phaser";

import Game from "./scenes/Game";
//import GameUI from "./scenes/GameUI";

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 1000,
  height: 1000,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [Game],
  scale: {
    zoom: 1,
  },
});
