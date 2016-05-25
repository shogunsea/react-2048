import Row from './Row.js'

const BOARD_SIZE = 4;

export default class Board {
  constructor(){
    this.grid = [];
    for(let i = 0; i < BOARD_SIZE; i++) {
      this.grid.push(new Row());
    }
  }

  getGrid(){
    return this.grid;
  }
}

// export default Board;
