import Row from './Row.js';
import _ from 'lodash';
import Cell from './Cell.js';
import SampleBoards from '../test/stub/sample_boards.json';

const BOARD_SIZE = 4;

export default class Board {
  constructor(){
    this.rows = [];
    for(let i = 0; i < BOARD_SIZE; i++) {
      this.rows.push(new Row());
    }
  }

  replaceWithTestBoard(boardName = 'board_A') {
    this.constructor();
    const sampleBoard = SampleBoards[boardName];

    for (let i = 0; i < BOARD_SIZE; i++) {
      const curRow = sampleBoard[i];
      for (let j = 0; j < BOARD_SIZE; j++) {
        const val = curRow[j];
        if (val != 0) {
          const cell = new Cell(i, j, val);
          this.addCellToBoard(cell);
        }
      }
    }

    return this.getRows();
  }

  addCellToBoard(cell) {
    if (!cell) {
      return;
    }

    const {curRow: row, curCol: col} = cell;
    this.getRow(row).addCell(cell);
    // this.getRow(row).setCell(row, cell);
  }

  getAvailableSlots() {
    const slots = [];
    const rows = this.getRows();

    for (let i = 0 ; i < BOARD_SIZE; i++) {
      slots.push([0,0,0,0]);
    }

    for(let i = 0; i < rows.length; i++) {
      const curRow = rows[i];
      // there will always be 4 empty grid in each row
      for (let j = 4; j < curRow.cells.length; j++) {
        const curCell = curRow.cells[j];
        if (curCell) {
          slots[curCell.curRow][curCell.curCol] = 1;
        }
      }
    }

    const availableSlots = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (slots[i][j] == 0) {
          availableSlots.push({row: i, col: j})
        }
      }
    }

    return availableSlots;
  }

  moveBoard(direction) {
    switch(direction) {
      case 0:
        this.moveLeft();
        break;
      case 1:
        this.moveUp();
        break;
      case 2:
        this.moveRight();
        break;
      case 3:
        this.moveDown();
        break;
    }
  }
    // 0 0 0           0 0 0
    // 0 0 0 --> left: 0 0 1
    // 0 1 0           0 0 0

    // 0
    // 4
    // 2
    // 0
    // move up:
    // 4
    // 2
    // 0
    // 0
    // move down:
    // 0
    // 0
    // 4
    // 2


    // 0
    // 4
    // 4
    // 2
    // move up:
    // 8
    // 2
    // 0
    // 0
    // move down:
    // 0
    // 0
    // 8
    // 2

  // rotateLeft() + moveLeft()/moveRight() == moveUp()/moveDown()
  // rotateLeft() + rotateLeft()*3 = originalBoard

    // 0 0 0                  0 0 0
    // 1 0 0 --> rotate left: 0 0 2
    // 0 2 0                  0 1 0
  moveLeft(){
    // 0 2  0  2 **  000022
    // move left: 4 0 0 0 ** 00004
    // move right 0 0 0 4 ** 00004
    // 0 0 0 2
    // move left:  2 0 0 0
    // move right: 0 0 0 2
    // 0 4 0 2  ** 000042
    // move left: 4 2 0 0 ** 000042
    // move right: 0 0 4 2 ** 000042

    const rows = this.getRows();
    for(let i = 0; i < rows.length; i++) {
      const curRow = rows[i];
      // there will always be 4 empty grid in each row
      for (let j = 4; j < curRow.cells.length; j++) {
        const curCell = curRow.cells[j];
        for (let k = j - 1; k > 3; k--) {
          const preCell = curRow[k];
          if (canMerge) {
            // drop j, keep k
            curCell.removed = true;
            // double value of k
            preCell.val *= 2;
            //  0222 ** 0000222
          }
        }
      }
    }

    console.log('this is left')
  }

  moveRight() {
    console.log('this is right')
  }

  moveUp() {
    console.log('this is up')
  }

  moveDown() {
    console.log('this is down')
  }

  swapTwoCells(cellA, cellB) {
    const tempRow = cellA.curRow;
    const tempCol = cellA.curCol;

  }

  mergeTwoCells(cellA, cellB) {

  }

  getRow(row) {
    return this.rows[row];
  }

  getRows(){
    return this.rows;
  }
}
