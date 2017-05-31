import Cell from './cell.js';
import SampleBoards from '../../test/stub/sample_boards.json';
import AbstractBoard from './abstractBoard.js';

const BOARD_SIZE = 4;
const VALUE_4_PROBABILITY = 8;

export default class Board extends AbstractBoard {
  constructor(args) {
    super(args);
    this.fillGridWithEmptyCell(this.grid);
  }

  moveBoard(direction, addRandomCell) {
    let hasMoved = false;
    switch(direction) {
      case 0:
        hasMoved = this.moveBoardTowards('left');
        break;
      case 1:
        hasMoved = this.moveBoardTowards('up');
        break;
      case 2:
        hasMoved = this.moveBoardTowards('right');
        break;
      case 3:
        hasMoved = this.moveBoardTowards('down');
        break;
    }
    if (hasMoved) {
      addRandomCell();
      this.recordCurrentState();
    }
  }

  recordMaxScore() {
    const cookie = document.cookie;
    if (cookie.indexOf('2048-max-score') === -1) {
      document.cookie = '2048-max-score=' + this.score;
    } else {
      const currentMaxScore = +document.cookie.match(/2048-max-score=(\d+)/)[1];
      if (currentMaxScore <= this.score) {
        document.cookie = '2048-max-score=' + this.score;
      }
    }
  }

  recordCurrentState() {
    this.recordCurrentBoard();
    this.recordCurrentScore();
  }

  recordCurrentScore() {
    const currentScore = this.getScore();
    document.cookie = '2048-stored-score=' + currentScore;
  }

  recordCurrentBoard() {
    const currentBoard = this.getBoard();
    let scoreString = '';

    for (let row = 0; row < currentBoard.length; row++) {
      for (let col = 0; col < currentBoard.length; col++) {
        const val = currentBoard[row][col]? currentBoard[row][col].val : 0;
        scoreString += val + ',';
      }
      scoreString += '!';
    }

    document.cookie = '2048-stored-board=' + scoreString;
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


  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomCell() {
    const availableSlots = this.getAvailableSlots();
    const availableLength = availableSlots.length;

    if (availableLength == 0) {
      console.log('niet, you\'re dead ');
      return null;
    }

    // [0, availableLength - 1]
    const index = ~~(Math.random() * availableLength);
    const slot = availableSlots[index];
    const row = slot.row;
    const col = slot.col;
    const valueFourRand = this.getRandomIntInclusive(0, 10);
    const val = valueFourRand > VALUE_4_PROBABILITY? 4 : 2;
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

    for (let i = 0; i < BOARD_SIZE; i++) {
      slots.push([0, 0, 0, 0]);
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
          availableSlots.push({row: i, col: j});
        }
      }
    }

    return availableSlots;
  }

  filterMergedCells() {
    const board = this.getBoard();

    for (let i = 0; i < board.length; i++) {
      board[i] = board[i].slice(0, 4);
    }
  }

  getRow(row) {
    return this.board[row];
  }

  getGrid() {
    return this.grid;
  }
}
