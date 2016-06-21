import _ from 'lodash';
import Cell from './Cell.js';
import SampleBoards from '../test/stub/sample_boards.json';

const BOARD_SIZE = 4;

export default class Board {
  constructor(){
    this.grid = [new Array(4), new Array(4), new Array(4), new Array(4)];
    this.board = _.cloneDeep(this.grid);
    this.fillGridWithEmptyCell(this.grid);
  }

  fillGridWithEmptyCell(grid) {
    for(let i = 0; i < BOARD_SIZE; i++) {
      for(let j = 0; j < BOARD_SIZE; j++) {
        grid[i][j] = new Cell(i, j, 0);
      }
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

    return this.getBoard();
  }

  getRandomCell() {
    const availableSlots = this.getAvailableSlots();
    const availableLength = availableSlots.length;

    if (availableLength == 0) {
      console.log('niet, you\'re dead ');
      return null;
    }

    const index = ~~(Math.random()* availableLength); // [0, availableLength - 1]
    const slot = availableSlots[index];
    const row = slot.row;
    const col = slot.col;
    const val = 2;
    const newCell = new Cell(row, col, val);
    return newCell;
  }

  addRandomCell() {
    const newCell = this.getRandomCell();
    this.addCellToBoard(newCell);
  }

  addCellToBoard(cell) {
    if (!cell) {
      return;
    }
    const {curRow: row, curCol: col} = cell;
    this.getRow(row)[col] = cell;
  }

  getAvailableSlots() {
    const slots = [];
    const board = this.getBoard();

    for (let i = 0 ; i < BOARD_SIZE; i++) {
      slots.push([0,0,0,0]);
    }

    for(let i = 0; i < board.length; i++) {
      const curRow = board[i];
      for (let j = 0; j < curRow.length; j++) {
        const curCell = curRow[j];
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
        this.moveLeftOrRight('left');
        break;
      case 1:
        this.moveUpOrDown('up');
        break;
      case 2:
        this.moveLeftOrRight('right');
        break;
      case 3:
        this.moveUpOrDown('down');
        break;
    }
  }

  getReachableRow(curCell) {
    const {curRow: row, curCol: col} = curCell;
    const board = this.getBoard();

    for (let i = row - 1; i >= 0; i--) {
      if (board[i][col]) {
        return i + 1;
      }
    }
    return 0;
  }

  getReachableCol() {

  }

  moveUpOrDown(direction) {
    console.log('direction: ' + direction);
    const board = this.getBoard();
    // col
    for (let j = 0; j < BOARD_SIZE; j++) {
      // row
      if (direction == 'up') {
        // row starts from top
        const targetRow = 0;
        for (let i = 0; i < BOARD_SIZE; i++) {
          const curRow = board[i];
          if (!curRow[j]) {
            continue;
          }

          const curCell = curRow[j];
          const preRow = curCell.curRow;
          const preCol = curCell.curCol;
          curCell.fromCol = preCol;
          curCell.fromRow = preRow;
          let movement = '';
          const toRow = this.getReachableRow(curCell);
          curCell.curRow = toRow;
          movement = "row_" + preRow + "_to_" + toRow;
          curCell.movement = movement;
          const newRow = curRow.map(function(cell) {
            if (!cell) {
              return;
            }
            if (cell.id != curCell.id) {
              return cell;
            }
          })
          board[i] = newRow;
          board[toRow][j] = curCell;
        }
      } else {
        // rows starts from bottom
        for (let i = BOARD_SIZE - 1; i >= 0; i--) {
          const curRow = board[i];
          if (!curRow[j]) {
            continue;
          }
          const curCell = curRow[j];
          const preRow = curCell.curRow;
          const preCol = curCell.curCol;
          curCell.fromCol = preCol;
          curCell.fromRow = preRow;
          let movement = '';
          curCell.curRow = 3;
          movement = "row_from_" + preRow + "_to_" + 3;
          curCell.movement = movement;
          const newRow = curRow.map(function(cell) {
            if (!cell) {
              return;
            }
            if (cell.id != curCell.id) {
              return cell;
            }
          })
          board[i] = newRow;
          board[3][j] = curCell;
        }
      }
    }
  }

  moveLeftOrRight(direction){
    console.log('direction: ' + direction);
    const board = this.getBoard();
    for (let i = 0; i < BOARD_SIZE; i++) {
      const curRow = board[i];
      if (curRow.length == 0) {
        continue;
      }
      // simple case: single cell movement, no merge
      for (let j = 0; j < curRow.length; j++) {
        const curCell = curRow[j];
        if (!curCell) {
          continue;
        }
        const preRow = curCell.curRow;
        const preCol = curCell.curCol;
        curCell.fromCol = preCol;
        curCell.fromRow = preRow;
        let movement = '';
        if (direction == 'left') {
          curCell.curCol = 0;
          movement = "col_from_" + preCol + "_to_" + 0;
        } else if(direction == 'right') {
          curCell.curCol = 3;
          movement = "col_from_" + preCol + "_to_" + 3;
        }
        curCell.movement = movement;
      }
    }
  }

  swapTwoCells(cellA, cellB) {
    const tempRow = cellA.curRow;
    const tempCol = cellA.curCol;
  }

  mergeTwoCells(cellA, cellB) {

  }

  getRow(row) {
    return this.board[row];
  }

  getBoard(){
    return this.board;
  }

  getGrid(){
    return this.grid;
  }
}
