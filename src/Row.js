import Cell from './Cell.js';

let tileId = 0;
const BOARD_SIZE = 4;

class Row {
  constructor () {
    this.cells = []
    this.id = tileId++;
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.cells.push(new Cell());
    }

  }

  setCell(col, cell) {
    this.cells[col] = cell;
  }
}

export default Row;
