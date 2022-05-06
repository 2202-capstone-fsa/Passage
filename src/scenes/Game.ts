import Phaser from "phaser"

export default class Game extends Phaser.Scene {
  constructor() {
    super("game")
  }

  // preload() {
  //   this.load.image('ground', 'tiles/RPGW_Town_v1.0/ground.png' )
  //   this.load.tilemapTiledJSON('overworld', 'tiles/overworld.json')
  // }

  // create() {
  //   //this.add.image(0,0, 'ground')
  //   const map = this.make.tilemap({ key: 'overworld' });
  //   const map.addTilesetImage("houses");

  // }
  preload() {
    this.load.image('houses', 'tiles/RPGW_Town_v1.0/houses.png');
    this.load.image('outside', 'tiles/RPGW_Town_v1.0/outside.png');
    this.load.image('player', 'NPC_CHaracters_v1/Male1.png');
    this.load.tilemapTiledJSON('overworld', 'tiles/overworld.json');
  }
  create() {

    const map = this.make.tilemap({ key:'overworld' });
    const townTileSet = map.addTilesetImage('Town', 'outside');
    const houseTileSet = map.addTilesetImage('Houses', 'houses');
    //const player = this.physics.add.sprite(10, 20, 'player', )
    
    map.createLayer('Ground', townTileSet);
    const housesLayer = map.createLayer('Houses', houseTileSet);
    const wallsLayer = map.createLayer('Walls', townTileSet);
    wallsLayer.setCollisionByProperty({ collides: true })
    housesLayer.setCollisionByProperty({ collides: true })

    // const debugDraw = (layer: Phaser.Tilemaps.TilemapLayer, scene: Phaser.Scene) => {
    //   const debugGraphics = scene.add.graphics().setAlpha(0.7)
    //   layer.renderDebug(debugGraphics, {
    //     tileColor: null,
    //     collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
    //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    //   })
    // }
    //map.create
  }
}

