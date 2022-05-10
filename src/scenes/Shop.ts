import Phaser from "phaser"

export default class Shop extends Phaser.Scene {
  constructor() {
    super("shop")
  }

  preload() {
    this.load.image('shop', 'tiles/RPGW_HousesAndInt_v1.1/interiors.png');
    this.load.image('decore', 'tiles/RPGW_HousesAndInt_v1.1/decorative_props.png');
    this.load.image('props', 'tiles/RPGW_HousesAndInt_v1.1/furniture.png');
    this.load.image('player', 'NPC_CHaracters_v1/Male1.png');
    this.load.tilemapTiledJSON('craftsman', 'tiles/craftsman.json');

  }

  create() {

    const map = this.make.tilemap({ key:'craftsman' });
    const shopTileSet = map.addTilesetImage('Shop', 'shop');
    const decoreTileSet = map.addTilesetImage('Decore', 'decore');
    const propsTileSet = map.addTilesetImage('Props', 'props');

    map.createLayer('black', shopTileSet);
    map.createLayer('ground', shopTileSet);
    const wallsLayer = map.createLayer('walls', shopTileSet);
    const decoreLayer = map.createLayer('decore', decoreTileSet);
    const decorationsLayer = map.createLayer('decorations', propsTileSet);
    //const decoreLayer = map.createLayer('decore', shopTileSet);

    wallsLayer.setCollisionByProperty({ collides: true })
    decoreLayer.setCollisionByProperty({ collides: true })
    decorationsLayer.setCollisionByProperty({ collides: true })


  }
}