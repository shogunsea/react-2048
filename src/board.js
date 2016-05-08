import Tile from './tile.js'

class Board {
  constructor(){
    this.tiles = [];
    for(let i = 0; i < 4; i++) {
      this.tiles.push(new Tile());
    }
  }

  getTiles(){
    return this.tiles;
  }
}

export default Board;
