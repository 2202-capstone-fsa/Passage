import Phaser from "phaser";
export default class Game extends Phaser.Scene {
    private parry;
    private leftScore;
    private leftScoreLabel;
    private rightScore;
    private rightScoreLabel;
    private paddleRightVelocity;
    private gameState;
    private ball;
    private paddleLeft;
    private paddleRight;
    private cursors;
    private paused;
    private white;
    constructor();
    preload(): void;
    create(): void;
    update(): void;
    checkGameState(): void;
    handleBallWorldBoundsCollision(body: any, up: any, down: any, left: any, right: any): void;
    handlePaddleBallCollision(): void;
    processPlayerInput(): void;
    updateAI(aiSpeed: any): void;
    checkScore(): void;
    incrementLeftScore(): void;
    incrementRightScore(): void;
    resetBall(spd?: number): void;
}
