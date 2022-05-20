import Phaser from "phaser";
import { debugDraw } from "../utils/debug";
import data from "../../public/tiles/overworld.json";
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

export default class ending extends Phaser.Scene {
  private parry!: "string";
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private message!: Phaser.GameObjects.Text;
  private objLayer!: Phaser.Tilemaps.ObjectLayer;
  private warning!: integer;
  private typewriteText!: Function;

  constructor() {
    super("ending");
  }

  preload() {
    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.cameras.main.centerOn(0, 0);

    let inventory = localStorage;
    let heart = inventory.heart;
    let brain = inventory.brain;
    let soul = inventory.soul;

    let text = "Place holder text";

    this.message = this.add
      .text(0, 0, "You leave the town.", {
        color: "white",
        backgroundColor: "black",
        fontSize: "18px",
        align: "center",
        baselineX: 0,
        baselineY: 0,
        wordWrap: { width: 500 },
      })
      .setWordWrapWidth(500);

    this.typewriteText = function (text) {
      const lines = this.message.getWrappedText(text);
      const wrappedText = lines.join("\n");
      const length = wrappedText.length;
      let i = 0;
      this.time.addEvent({
        callback: () => {
          this.message.text += wrappedText[i];
          ++i;
        },
        repeat: length - 1,
        delay: 10,
      });
    };

    if (heart && soul && brain) {
      text =
        "The heart, the soul, the brain. The body is not complete without the soul, and the soul without the body. Having recovered all 3 pieces you feel a strong force moving you forward. The world of the living begins to fade away, and you move towards your next step in your passage.";
    } else if (heart || soul || brain) {
      text =
        "With only part of your being in your possession, you feel incomplete. You feel a heavy, overbearing weight draw you back towards the uninhabited town. Perhaps there is something unfinished? Your body, mind and soul, stuck in a strange disconnect between this world and the next, fractures and sheers. Then you awaken, wondering it it was all a dream..";
    } else {
      text =
        "Locations are left unexplored and their purposes remain undiscovered. You travel deeper into the darkness. Your body weakens and your limbs loosen. Bit by bit you are torn apart and dissolved into the ether. At the last moment of conciousness, a pinhole of light appears and you reach for it. You reawaken wondering if it was all a dream..";
    }

    let endTexts = text.match(/[^\.!\?]+[\.!\?]+/g);
    let counter = -1;

    // Hit spacebar to interact with objects.
    this.cursors.space.on("down", () => {
      this.message.text = "";
      counter++;
      endTexts[counter]
        ? this.typewriteText(endTexts[counter])
        : this.scene.start("game");
    });
  }
  update(t: number, dt: number) {
    if (!this.cursors || !this.player) {
      return;
    }
  }
}
