import _ from 'lodash';
import Cell from './Cell.js';
import SampleBoards from '../test/stub/sample_boards.json';
import MovableBoard from './MovableBoard.js';

const BOARD_SIZE = 4;

export default class Board extends MovableBoard {
  constructor(){
    super()
    this.fillGridWithEmptyCell(this.grid);
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
          this.setCellToBoard(cell);
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
    this.setCellToBoard(newCell);
  }

  setCellToBoard(cell) {
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

    for(let i = 0; i < BOARD_SIZE; i++) {
      const curRow = board[i];
      for (let j = 0; j < curRow.length; j++) {
        const curCell = curRow[j];
        if (curCell && !curCell.merged) {
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

  filterMergedCells() {
    const board = this.getBoard();

    for (let i = 0; i < board.length; i++) {
      board[i] = board[i].slice(0,4);
    }
  }

  getRow(row) {
    return this.board[row];
  }

  getGrid(){
    return this.grid;
  }
}
