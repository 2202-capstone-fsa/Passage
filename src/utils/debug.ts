import Phaser from "phaser";

const debugDraw = (layer: Phaser.Tilemaps., scene: Phaser.Scene) => {
  const debugGraphics = scene.add.graphics().setAlpha(0.7);

  layer.renderDebug(debugGraphics, {
    tileColor: null,
    collidingTileColor: new Phaser.Display.Color(234, 234, 48, 24),
    faceColor: new Phaser.Display.Color(40, 39, 37, 255),
  });
};

export {
  debugDraw
}
