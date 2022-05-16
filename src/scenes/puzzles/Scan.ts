import { World } from "matter";
import Phaser from "phaser";
import WebFontFile from "../../utils/WebFontFile";

const GameState = {
  Running: "running",
  Still: "be-still",
  PlayerWon: "player-won",
  PlayerLost: "player-lost",
};

export default class Game extends Phaser.Scene {
  private parry!: string;
  private leftScore!: number;
  private leftScoreLabel!: any;
  private rightScore!: number;
  private rightScoreLabel!: any;
  private paddleRightVelocity!: any;
  private gameState!: string;
  private ball!: any;
  private paddleLeft!: Phaser.GameObjects.Rectangle;
  private paddleRight!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private paused!: boolean;
  private white = 0xffffff;

  constructor() {
    super("scan");
    this.gameState = GameState.Running;
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);
    this.leftScore = 0;
    this.rightScore = 0;
  }

  preload() {
    const fonts = new WebFontFile(this.load, "Press Start 2P");
    this.load.addFile(fonts);
    this.load.audio("ding", "audio/sounds/ding.mp3");
    this.load.audio("bling", "audio/sounds/bling.mp3");
    this.load.audio("weirdwave", "audio/sounds/weirdwave.mp3");
    this.load.audio("lightimpact", "audio/sounds/impact.mp3");
    this.load.audio("poweron", "audio/sounds/poweron.mp3");
    this.load.audio("ballhit", "audio/sounds/ballhit.wav");
  }

  create() {
    this.scene.run("scan-background");
    this.scene.sendToBack("scan-background");
    // Above lines equivalent to the next few:
    // this.add.line(400, 250, 0, 0, 0, 500, this.white, 1).setLineWidth(2, 2);
    // this.add.circle(400, 250, 25).setStrokeStyle(3, this.white, 1);

    //Makes the ball go off the grid

    this.physics.world.setBounds(-100, 0, 1000, 500);

    this.ball = this.add.circle(400, 250, 10, this.white, 1);
    this.physics.add.existing(this.ball);
    this.ball.body.setCircle(10);
    this.ball.body.setCollideWorldBounds(true, 1, 1);
    this.ball.body.setBounce(1, 1);

    this.paddleLeft = this.add.rectangle(60, 250, 20, 100, this.white, 1);
    this.physics.add.existing(this.paddleLeft, true);
    this.physics.add.collider(
      this.paddleLeft,
      this.ball,
      this.handlePaddleBallCollision,
      undefined,
      this
    );

    this.paddleRight = this.add.rectangle(740, 250, 20, 100, this.white, 1);
    this.physics.add.existing(this.paddleRight, true);
    this.physics.add.collider(
      this.paddleRight,
      this.ball,
      this.handlePaddleBallCollision,
      undefined,
      this
    );

    this.physics.world.on(
      "worldbounds",
      this.handleBallWorldBoundsCollision,
      this
    );

    let scoreStyle: any;
    scoreStyle = {
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
    if (this.gameState === GameState.PlayerLost) {
      console.log("Player lost.");
      //Start loss scene
    }
    if (this.gameState === GameState.PlayerWon) {
      console.log("Player won!");
      //Start won scene
    }
    if (this.gameState === GameState.Still) {
      this.processPlayerInput();
      this.updateAI(4);
      this.checkScore();
      //this.scene.stop("scan-background");
      //Stop old bg, start new one.
      //
      //
      if (
        this.cursors.up.isDown ||
        this.cursors.down.isDown ||
        this.cursors.left.isDown ||
        this.cursors.right.isDown
      ) {
        this.gameState = GameState.PlayerLost;
      }

      return;
    }
    if (
      (this.gameState !== GameState.Still && this.paused) ||
      this.gameState !== GameState.Running
    )
      return;

    this.processPlayerInput();
    this.updateAI(3);
    this.checkScore();
  }

  handleBallWorldBoundsCollision(body, up, down, left, right) {
    if (left || right) {
      return;
    }
    this.sound.play("ballhit");

    /**@type {Phaser.Physics.Arcade.Body} */
    const vel = this.ball.body.velocity;
    vel.x *= 1.05;
    vel.y *= 1.05;
    body.setVelocity(vel.x, vel.y);
  }

  handlePaddleBallCollision() {
    this.sound.play("ballhit");

    /**@type {Phaser.Physics.Arcade.Body} */
    const body = this.ball.body;
    const vel = body.velocity;
    vel.x *= 1.05;
    vel.y *= 1.05;

    body.setVelocity(vel.x, vel.y);
  }

  processPlayerInput() {
    /** @type {Phaser.Physics.Arcade.StaticBody} */
    let playerPaddle!: any;
    playerPaddle = this.paddleLeft.body;

    if (this.cursors.up.isDown) {
      this.paddleLeft.y -= 10;
      playerPaddle.updateFromGameObject();
    } else if (this.cursors.down.isDown) {
      this.paddleLeft.y += 10;
      playerPaddle.updateFromGameObject();
    }
  }

  updateAI(aiSpeed) {
    const diff = this.ball.y - this.paddleRight.y;

    if (Math.abs(diff) < 10) return;
    if (diff < 0) {
      this.paddleRightVelocity.y = -aiSpeed;
      if (this.paddleRightVelocity.y < -10) this.paddleRightVelocity = -10;
    } else if (diff > 0) {
      this.paddleRightVelocity.y = aiSpeed;
      if (this.paddleRightVelocity.y > 10) this.paddleRightVelocity.y = 10;
    }

    this.paddleRight.y += this.paddleRightVelocity.y;
    let aiPaddle!: any;
    aiPaddle = this.paddleRight.body;
    aiPaddle.updateFromGameObject();
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
    if (this.leftScore >= 1 && this.leftScore < maxScore) {
      this.gameState = GameState.Still;
      this.ball.setPosition(400, 250);
      let currentX = this.ball.body.velocity.x;
      let currentY = this.ball.body.velocity.y;
      this.ball.body.setVelocity(currentX * 2, currentY * 3);
      this.resetBall();
    }

    if (this.rightScore >= maxScore || this.leftScore >= maxScore) {
      console.log("winner");
      this.gameState = GameState.PlayerWon;
      this.resetBall();
    }

    if (
      this.gameState !== GameState.PlayerLost ||
      this.gameState !== GameState.PlayerWon
    ) {
      this.resetBall();
    } else {
      this.ball.active = false;
      this.physics.world.remove(this.ball.body);

      // Stop current scene and enter result in hospital.
      // this.scene.stop(GameBackground);
      // this.scene.start(GameOver, {
      //   leftScore: this.leftScore,
      //   rightScore: this.rightScore,
      // });
    }
  }

  incrementLeftScore() {
    this.leftScore += 1;
    this.leftScoreLabel.text = this.leftScore;
    console.log(this.leftScore);
    this.sound.play("ding");
  }

  incrementRightScore() {
    this.rightScore += 1;
    this.rightScoreLabel.text = this.rightScore;
    console.log(this.rightScore);
    this.sound.play("bling");
  }

  resetBall(spd = 450) {
    if (this.gameState === GameState.Still) {
      spd = 800;
    }
    //Resets location of ball to middle AND angle.
    this.ball.setPosition(400, 250);
    const angleArray = [45, 135, 225, 315];
    const angle = angleArray[Math.floor(Math.random() * angleArray.length)];
    const vec = this.physics.velocityFromAngle(angle, spd);

    this.ball.body.setVelocity(vec.x, vec.y);
  }
}
