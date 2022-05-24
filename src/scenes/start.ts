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

export default class start extends Phaser.Scene {
  private parry!: "string";
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private message!: Phaser.GameObjects.Text;
  private objLayer!: Phaser.Tilemaps.ObjectLayer;
  private warning!: integer;
  private typewriteText!: Function;

  constructor() {
    super("start");
  }

  preload() {
    //Load keyboard for player to use.
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    //this.cameras.main.centerOn(1000, 1000);

    let text = `How long do I have to wait? I wish he would come home. Just walk in through that door. It feels like it's been forever. I've got dinner waiting... ... >You awaken in a dim room. >It's daytime. Oh man, what a splitting \n headache... Why do I not remember \n a thing? Where am I... Did I take a tumble? Maybe if I move around \n I can get my bearings. Up I go.`;

    this.message = this.add
      .text(200, 200, "You hear a voice. \n \n (Press SPACE to continue)", {
        color: "lightblue",
        fontFamily: "Helvetica",
        backgroundColor: "black",
        fontSize: "20px",
        align: "center",
        baselineX: 0,
        baselineY: 0,
        wordWrap: { width: 400 },
      })
      .setWordWrapWidth(400);

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

    //split into array of sentences
    let endTexts = text.match(/[^\.!\?]+[\.!\?]+/g);
    let counter = -1;

    let startHome = () => {
      window.scrollTo(130, 110);
      this.scene.start("home");
    };

    // Hit spacebar to interact with objects.
    this.cursors.space.on("down", () => {
      this.message.text = "";
      counter++;
      endTexts[counter] ? this.typewriteText(endTexts[counter]) : startHome();
    });
  }
  update(t: number, dt: number) {
    if (!this.cursors || !this.player) {
      return;
    }
  }
}
