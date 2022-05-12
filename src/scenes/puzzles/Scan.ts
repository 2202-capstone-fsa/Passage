import Phaser from "phaser";
import WebFontFile from "./WebFontFile";

import { GameBackground, GameOver } from "../consts/SceneKeys";
import * as Colors from "../consts/Colors";

const GameState = {
  Running: "running",
  PlayerWon: "player-won",
  AIWon: "ai-won",
};

export default class Game extends Phaser.Scene {
  init() {
    this.gameState = GameState.Running;

    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);
    this.leftScore = 0;
    this.rightScore = 0;
  }

  preload() {
    const fonts = new WebFontFile(this.load, "Press Start 2P");
    this.load.addFile(fonts);
  }

  create() {
    this.scene.run(GameBackground);
    this.scene.sendToBack(GameBackground);

    //Makes the ball go off the grid
    this.physics.world.setBounds(-100, 0, 1000, 500);

    this.ball = this.add.circle(400, 250, 10, Colors.White, 1);
    this.physics.add.existing(this.ball);
    this.ball.body.setCircle(10);
    this.ball.body.setCollideWorldBounds(true, 1, 1);
    this.ball.body.setBounce(1, 1);

    this.paddleLeft = this.add.rectangle(60, 250, 20, 100, Colors.White, 1);
    this.physics.add.existing(this.paddleLeft, true);
    this.physics.add.collider(this.paddleLeft, this.ball);

    this.paddleRight = this.add.rectangle(740, 250, 20, 100, Colors.White, 1);
    this.physics.add.existing(this.paddleRight, true);
    this.physics.add.collider(this.paddleRight, this.ball);

    const scoreStyle = {
      fontSize: 48,
      fontFamily: '"Press Start 2P"',
    };

    this.leftScoreLabel = this.add
      .text(300, 125, "0", scoreStyle)
      .setOrigin(0.5, 0.5);

    this.rightScoreLabel = this.add
      .text(500, 125, "0", scoreStyle)
      .setOrigin(0.5, 0.5);

    this.cursors = this.input.keyboard.createCursorKeys();

    //Wait to start so it's not immediate.
    this.time.delayedCall(500, () => {
      this.resetBall();
    });
  }

  update() {
    if (this.paused || this.gameState !== GameState.Running) return;

    this.processPlayerInput();
    this.updateAI();
    this.checkScore();
  }

  processPlayerInput() {
    /** @type {Phaser.Physics.Arcade.StaticBody} */
    const body = this.paddleLeft.body;

    if (this.cursors.up.isDown) {
      this.paddleLeft.y -= 10;
      body.updateFromGameObject();
    } else if (this.cursors.down.isDown) {
      this.paddleLeft.y += 10;
      body.updateFromGameObject();
    }
  }

  updateAI() {
    const diff = this.ball.y - this.paddleRight.y;
    const aiSpeed = 3;

    if (Math.abs(diff) < 10) return;
    if (diff < 0) {
      this.paddleRightVelocity.y = -aiSpeed;
      if (this.paddleRightVelocity.y < -10) this.paddleRightVelocity = -10;
    } else if (diff > 0) {
      this.paddleRightVelocity.y = aiSpeed;
      if (this.paddleRightVelocity.y > 10) this.paddleRightVelocity.y = 10;
    }

    this.paddleRight.y += this.paddleRightVelocity.y;
    this.paddleRight.body.updateFromGameObject();
  }

  checkScore() {
    const x = this.ball.x;
    const leftBounds = -30;
    const rightBounds = 830;

    if (x >= leftBounds && x <= rightBounds) return;

    if (this.ball.x < leftBounds) {
      //Scored on the left
      this.incrementRightScore();
    } else if (this.ball.x > rightBounds) {
      //Scored on the right
      this.incrementLeftScore();
    }

    const maxScore = 7;
    if (this.leftScore >= maxScore) {
      //player won
      this.gameState = GameState.PlayerWon;
    } else if (this.rightScore >= maxScore) {
      //AI won
      this.gameState = GameState.AIWon;
    }

    if (this.gameState === GameState.Running) {
      this.resetBall();
    } else {
      this.ball.active = false;
      this.physics.world.remove(this.ball.body);

      this.scene.stop(GameBackground);

      this.scene.start(GameOver, {
        leftScore: this.leftScore,
        rightScore: this.rightScore,
      });

      //show the game over/win screen
    }
  }

  incrementLeftScore() {
    this.leftScore += 1;
    this.leftScoreLabel.text = this.leftScore;
  }

  incrementRightScore() {
    this.rightScore += 1;
    this.leftScoreLabel.text = this.rightScore;
  }

  resetBall() {
    //Resets location of ball to middle AND angle.
    this.ball.setPosition(400, 250);
    const angle = Phaser.Math.Between(0, 360);
    const vec = this.physics.velocityFromAngle(angle, 350);

    this.ball.body.setVelocity(vec.x, vec.y);
  }
}
