import Cell from './cell.js';
import SampleBoards from '../../test/stub/sample_boards.json';
import AbstractBoard from './abstractBoard.js';
// extend board functionalities by decorating board instance
// with methods from these two class.
import BoardAction from '../helper/boardAction.js';
import BoardState from '../helper/boardState.js';

const BOARD_SIZE = 4;
const VALUE_4_PROBABILITY = 8;

export default class Board extends AbstractBoard {
   /**
    * @param  {Array} boardData - optional array to initialize the board
    * @param  {number} boardSize - optional integer to configure the board
    */
  constructor(boardData = null, boardSize = 4) {
    super(boardSize);

    // size of boardData takes precedence
    if (boardData) {
      const rowLen = boardData.length;
      for (let row = 0; row < rowLen; row++) {
        const currentRow = boardData[row];
        const colLen = currentRow.length;
        for (let col = 0; col < colLen; col++) {
          const val = boardData[row][col];
          if (val) {
            const newCell = new Cell(row, col, val);
            this.board[row][col] = newCell;
          }
        }
      }
    }

    this.hasWon = false;
    this.hasLost = false;
    this.score = 0;

    // Inject actions and states handlers
    const handlers = this.getHandlers();
    this.decorateWith(handlers);

    this.fillGridWithEmptyCell(this.grid);
  }

  getHandlers() {
    const actionHandler = new BoardAction();
    const stateHandler = new BoardState();
    return [actionHandler, stateHandler];
  }

  decorateWith(handlers) {
    for (let handler of handlers) {
      handler.decorate(this);
    }
  }

  // State/Board
  isMovable() {
    return this.hasEmptySlots() || this.hasMergeableSlots();
  }

  // Action
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

  // Action
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

  // Action
  recordCurrentState() {
    this.recordCurrentBoard();
    this.recordCurrentScore();
  }

  // Action
  recordCurrentScore() {
    const currentScore = this.getScore();
    document.cookie = '2048-stored-score=' + currentScore;
  }

  // Action
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

  // // Action
  fillGridWithEmptyCell(grid) {
    for(let i = 0; i < BOARD_SIZE; i++) {
      for(let j = 0; j < BOARD_SIZE; j++) {
        grid[i][j] = new Cell(i, j, 0);
      }
    }
  }

  // Action
  replaceWithTestBoard(boardName = 'board_A') {
    this.constructor();
    const sampleBoard = SampleBoards[boardName];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const curRow = sampleBoard[i];
      for (let j = 0; j < BOARD_SIZE; j++) {
        const val = curRow[j];
        if (val) {
          const cell = new Cell(i, j, val);
          this.setCellToBoard(cell);
        }
      }
    }

    return this.getBoard();
  }

  // ? helper
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

  /**
   * Score related method
   */

  getScore() {
    return this.score;
  }

  // Action
  updateScore(score) {
    this.score += score;
  }
}
