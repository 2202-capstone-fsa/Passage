import Phaser from "phaser";

import Game from "./scenes/Game";
import Preloader from "./scenes/Preloader";
import Hospital from "./scenes/Hospital";

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 1600,
  height: 1600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [Preloader, Game, Hospital],
  scale: {
    zoom: 8,
  },
});
