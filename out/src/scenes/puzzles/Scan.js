"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var phaser_1 = __importDefault(require("phaser"));
var WebFontFile_1 = __importDefault(require("../../utils/WebFontFile"));
var GameState = {
    Running: "running",
    Still: "be-still",
    PlayerWon: "player-won",
    PlayerLost: "player-lost",
};
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this, "scan") || this;
        _this.white = 0xffffff;
        _this.gameState = GameState.Running;
        _this.paddleRightVelocity = new phaser_1.default.Math.Vector2(0, 0);
        _this.leftScore = 0;
        _this.rightScore = 0;
        return _this;
    }
    Game.prototype.preload = function () {
        var fonts = new WebFontFile_1.default(this.load, "Press Start 2P");
        this.load.addFile(fonts);
        this.load.audio("ding", "audio/sounds/ding.mp3");
        this.load.audio("bling", "audio/sounds/bling.mp3");
        this.load.audio("weirdwave", "audio/sounds/weirdwave.mp3");
        this.load.audio("lightimpact", "audio/sounds/impact.mp3");
        this.load.audio("poweron", "audio/sounds/poweron.mp3");
        this.load.audio("ballhit", "audio/sounds/ballhit.wav");
    };
    Game.prototype.create = function () {
        var _this = this;
        // this.scene.run("scan-background");
        // this.scene.sendToBack("scan-background");
        // Above lines equivalent to the next few:
        this.add.line(400, 250, 0, 0, 0, 500, this.white, 1).setLineWidth(2, 2);
        this.add.circle(400, 250, 25).setStrokeStyle(3, this.white, 1);
        //Makes the ball go off the grid
        this.physics.world.setBounds(-100, 0, 1000, 500);
        this.ball = this.add.circle(400, 250, 10, this.white, 1);
        this.physics.add.existing(this.ball);
        this.ball.body.setCircle(10);
        this.ball.body.setCollideWorldBounds(true, 1, 1);
        this.ball.body.setBounce(1, 1);
        this.paddleLeft = this.add.rectangle(60, 250, 20, 100, this.white, 1);
        this.physics.add.existing(this.paddleLeft, true);
        this.physics.add.collider(this.paddleLeft, this.ball, this.handlePaddleBallCollision, undefined, this);
        this.paddleRight = this.add.rectangle(740, 250, 20, 100, this.white, 1);
        this.physics.add.existing(this.paddleRight, true);
        this.physics.add.collider(this.paddleRight, this.ball, this.handlePaddleBallCollision, undefined, this);
        this.physics.world.on("worldbounds", this.handleBallWorldBoundsCollision, this);
        var scoreStyle;
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
        this.time.delayedCall(500, function () {
            _this.resetBall();
        });
        this.cameras.main.zoom = 0.75;
        window.scrollTo(600, 600);
    };
    Game.prototype.update = function () {
        this.checkGameState();
        this.processPlayerInput();
        this.updateAI(3);
        this.checkScore();
    };
    Game.prototype.checkGameState = function () {
        if (this.gameState === GameState.PlayerLost) {
            this.gameState = GameState.Running;
            this.leftScore = 0;
            this.rightScore = 0;
            this.scene.stop("scan");
            this.scene.stop("scan-background");
            localStorage.setItem("Brain Scan", "Too blurry! The doctor can't interpret this.");
            this.scene.start("hospital");
            //Start loss scene
        }
        if (this.gameState === GameState.PlayerWon) {
            this.scene.stop("scan");
            this.scene.stop("scan-background");
            localStorage.setItem("Brain Scan", "A beautiful mind.");
            this.scene.start("hospital");
            //Start won scene
        }
        if (this.gameState === GameState.Still) {
            this.processPlayerInput();
            this.updateAI(4);
            this.checkScore();
            this.cameras.main.setBackgroundColor(0xff0000);
            //this.scene.stop("scan-background");
            //Stop old bg, start new one.
            //
            //
            if (this.cursors.up.isDown ||
                this.cursors.down.isDown ||
                this.cursors.left.isDown ||
                this.cursors.right.isDown) {
                this.gameState = GameState.PlayerLost;
            }
            return;
        }
        if ((this.gameState !== GameState.Still && this.paused) ||
            this.gameState !== GameState.Running)
            return;
    };
    Game.prototype.handleBallWorldBoundsCollision = function (body, up, down, left, right) {
        if (left || right) {
            return;
        }
        this.sound.play("ballhit");
        /**@type {Phaser.Physics.Arcade.Body} */
        var vel = this.ball.body.velocity;
        vel.x *= 1.05;
        vel.y *= 1.05;
        body.setVelocity(vel.x, vel.y);
    };
    Game.prototype.handlePaddleBallCollision = function () {
        this.sound.play("ballhit");
        /**@type {Phaser.Physics.Arcade.Body} */
        var body = this.ball.body;
        var vel = body.velocity;
        vel.x *= 1.05;
        vel.y *= 1.05;
        body.setVelocity(vel.x, vel.y);
    };
    Game.prototype.processPlayerInput = function () {
        /** @type {Phaser.Physics.Arcade.StaticBody} */
        var playerPaddle;
        playerPaddle = this.paddleLeft.body;
        if (this.cursors.up.isDown) {
            this.paddleLeft.y -= 10;
            playerPaddle.updateFromGameObject();
        }
        else if (this.cursors.down.isDown) {
            this.paddleLeft.y += 10;
            playerPaddle.updateFromGameObject();
        }
    };
    Game.prototype.updateAI = function (aiSpeed) {
        var diff = this.ball.y - this.paddleRight.y;
        if (Math.abs(diff) < 10)
            return;
        if (diff < 0) {
            this.paddleRightVelocity.y = -aiSpeed;
            if (this.paddleRightVelocity.y < -10)
                this.paddleRightVelocity = -10;
        }
        else if (diff > 0) {
            this.paddleRightVelocity.y = aiSpeed;
            if (this.paddleRightVelocity.y > 10)
                this.paddleRightVelocity.y = 10;
        }
        this.paddleRight.y += this.paddleRightVelocity.y;
        var aiPaddle;
        aiPaddle = this.paddleRight.body;
        aiPaddle.updateFromGameObject();
    };
    Game.prototype.checkScore = function () {
        var x = this.ball.x;
        var leftBounds = -30;
        var rightBounds = 830;
        if (x >= leftBounds && x <= rightBounds)
            return;
        if (this.ball.x < leftBounds) {
            //Scored on the left
            this.incrementRightScore();
        }
        else if (this.ball.x > rightBounds) {
            //Scored on the right
            this.incrementLeftScore();
        }
        var maxScore = 7;
        if (this.leftScore >= 1 && this.leftScore < maxScore) {
            this.gameState = GameState.Still;
            this.ball.setPosition(400, 250);
            var currentX = this.ball.body.velocity.x;
            var currentY = this.ball.body.velocity.y;
            this.ball.body.setVelocity(currentX * 2, currentY * 3);
            this.resetBall();
        }
        if (this.rightScore >= maxScore || this.leftScore >= maxScore) {
            this.gameState = GameState.PlayerWon;
            this.resetBall();
        }
        if (this.gameState !== GameState.PlayerLost ||
            this.gameState !== GameState.PlayerWon) {
            this.resetBall();
        }
        else {
            this.ball.active = false;
            this.physics.world.remove(this.ball.body);
            // Stop current scene and enter result in hospital.
            // this.scene.stop(GameBackground);
            // this.scene.start(GameOver, {
            //   leftScore: this.leftScore,
            //   rightScore: this.rightScore,
            // });
        }
    };
    Game.prototype.incrementLeftScore = function () {
        this.leftScore += 1;
        this.leftScoreLabel.text = this.leftScore;
        this.sound.play("ding");
    };
    Game.prototype.incrementRightScore = function () {
        this.rightScore += 1;
        this.rightScoreLabel.text = this.rightScore;
        this.sound.play("bling");
    };
    Game.prototype.resetBall = function (spd) {
        if (spd === void 0) { spd = 450; }
        if (this.gameState === GameState.Still) {
            spd = 1200;
        }
        //Resets location of ball to middle AND angle.
        this.ball.setPosition(400, 250);
        var angleArray = [45, 135, 225, 315];
        var angle = angleArray[Math.floor(Math.random() * angleArray.length)];
        var vec = this.physics.velocityFromAngle(angle, spd);
        this.ball.body.setVelocity(vec.x, vec.y);
    };
    return Game;
}(phaser_1.default.Scene));
exports.default = Game;
//# sourceMappingURL=Scan.js.map