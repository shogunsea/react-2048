import Cell from './Cell.js';

let tileId = 0;
const BOARD_COLUMNS = 4;

class Row {
  constructor (cells) {
    if (cells) {
      this.cells = cells;
    } else {
      this.cells = []
      this.id = tileId++;
      for (let i = 0; i < BOARD_COLUMNS; i++) {
        this.cells.push(new Cell());
      }
    }
  }

  setCell(col, cell) {
    this.cells[col] = cell;
  }

  addCell(cell) {
    this.cells.push(cell);
  }
}

export default Row;
