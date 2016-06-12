import Row from './Row.js'
import _ from 'lodash'

const BOARD_SIZE = 4;

export default class Board {
  constructor(){
    this.rows = [];
    for(let i = 0; i < BOARD_SIZE; i++) {
      this.rows.push(new Row());
    }
  }

  addCellToBoard(cell) {
    const {curRow: row, curCol: col} = cell;
    this.getRow(row).addCell(cell);
  }

  getRow(row) {
    return this.rows[row];
  }

  getRows(){
    return this.rows;
  }
}
