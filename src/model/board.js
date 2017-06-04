import AbstractBoard from './abstractBoard.js';
import Cell from './cell.js';
import BoardAction from '../helper/boardAction.js';
import BoardState from '../helper/boardState.js';
import SampleBoards from '../../test/stub/sample_boards.json';
import {getRandomIntInclusive} from '../helper/utils.js';

// 8/10 --> 80%
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
            this.getBoard()[row][col] = newCell;
          }
        }
      }
    }

    this.hasWon = false;
    this.hasLost = false;
    this.score = 0;

    const decorators = this.getDecorators();
    this.decorateWith(decorators);

    this.fillGridWithEmptyCell(this.grid);
  }

  getDecorators() {
    const actionHandler = new BoardAction();
    const stateHandler = new BoardState();
    return [actionHandler, stateHandler];
  }

  decorateWith(decorators) {
    for (let decorator of decorators) {
      decorator.decorate(this);
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

  /**
   * Initialize the grid by filling it with empty cells,
   *   visually 'grid' is the one being rendered as the board
   *   'board' is the data model that holds the cells.
   * @param  {Array} grid - Grid array of the board
   */
  fillGridWithEmptyCell(grid) {
    const rowLen = grid.length;
    for(let i = 0; i < rowLen; i++) {
      const colLen = grid[i].length;
      for(let j = 0; j < colLen; j++) {
        grid[i][j] = new Cell(i, j, 0);
      }
    }
  }

  /**
   * @param  {string} boardName - optional board name to fetch
   *   from sample boards
   * @return {array} updated board array.
   */
  replaceWithTestBoard(boardName = 'board_A') {
    this.constructor();
    const sampleBoard = SampleBoards[boardName];

    if (!sampleBoard) {
      console.ward(boardName + ' not found.');
      return;
    }

    const rowLen = sampleBoard.length;

    for (let i = 0; i < rowLen; i++) {
      const curRow = sampleBoard[i];
      const colLen = curRow.length;

      for (let j = 0; j < colLen; j++) {
        const val = curRow[j];
        if (val) {
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

    // [0, availableLength - 1]
    const index = ~~(Math.random() * availableLength);
    const slot = availableSlots[index];
    const row = slot.row;
    const col = slot.col;
    const valueFourRand = getRandomIntInclusive(0, 10);
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


  // TODO: refactor this method: why does it need to check if cell is merged
  // or not just for filtering?
  /**
   * @return {array} A list of objects that represent the position
   * of available slots.
   */
  getAvailableSlots() {
    const slots = [];
    const board = this.getBoard();
    const rowLen = board.length;

    // ? OGKW: Only God knows Why ¯\_(ツ)_/¯
    for (let i = 0; i < rowLen; i++) {
      slots.push([0, 0, 0, 0]);
    }

    for(let i = 0; i < rowLen; i++) {
      const curRow = board[i];
      const colLen = curRow.length;
      for (let j = 0; j < colLen; j++) {
        const curCell = curRow[j];
        if (curCell && !curCell.merged) {
          slots[curCell.curRow][curCell.curCol] = 1;
        }
      }
    }

    const availableSlots = [];

    for (let i = 0; i < rowLen; i++) {
      const colLen = board[i].length;
      for (let j = 0; j < colLen; j++) {
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
    return this.getBoard()[row];
  }

  getGrid() {
    return this.grid;
  }

  /**
   * Score related method
   */

  /**
   * @return {number} Current score.
   */
  getScore() {
    return this.score;
  }

  /**
   * @param  {number} score - new score
   */
  updateScore(score) {
    this.score += score;
  }
}
