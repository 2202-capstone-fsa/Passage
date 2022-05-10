import Phaser from "phaser";

//import Preloader from "./scenes/Preloader";
import Game from "./scenes/Game";
import Maze from "./scenes/Maze";
import Shop from "./scenes/Shop";

// import GameUI from "./scenes/GameUI";

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 1600,
  height: 1600,
  // physics: {
  //   default: "arcade",
  //   arcade: {
  //     gravity: { y: 0 },
  //     debug: false,
  //   },
  // },
  scene: [Shop, Maze, Game ],
  // scale: {
  //   zoom: 2,
  // },
});
