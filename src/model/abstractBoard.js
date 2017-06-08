import {cloneDeep} from 'lodash';

/**
  Abstract board represents data model for very generic
  and simple board. It should be agnostic of what's the
  board would be used for.
*/
export default class AbstractBoard {
  /**
   * Constructor, taks one optional array as input to
   *   for initialization.
   * @constructor
   * @param  {number} boardSize - optional integer to configure the board
   */
  constructor(boardSize = 4) {
    this.grid = [];

    for (let i = 0; i < boardSize; i++) {
      this.grid[i] = new Array(boardSize);
    }

    this.board = cloneDeep(this.grid);
  }

  /**
   * Checks if board has empty slots
   * @return {Boolean} Whether current board has empty slots.
   */
  hasEmptySlots() {
    const board = this.getBoard();
    const rowLen = board.length;
    let hasSlots = false;

    for (let i = 0; i < rowLen; i++) {
      const currentRow = board[i];
      const colLen = currentRow.length;

      for (let j = 0; j < colLen; j++) {
        if (!board[i][j]) {
          hasSlots = true;
          return hasSlots;
        }
      }
    }

    return hasSlots;
  }

  /**
   * Print cell values in current board along with
   *   debugging message for context.
   * @param  {String} message - debugging message to be printed
   * @param  {Number} padding - padding between each message
   */
  print(message = '', padding = 2) {
    const row = this.getBoard().length;
    console.log(message);

    for (let i = 0; i < row; i++) {
      const currentRow = this.getBoard()[i];
      let rowContent = '';

      for (let j = 0; j < currentRow.length; j++) {
        const cell = currentRow[j];
        if (cell) {
          rowContent += cell.val + ' ';
        } else {
          rowContent += '0 ';
        }
      }

      const rowString = `[${rowContent}]`;
      console.log(rowString);
    }

    for (let j = 0; j < padding; j++) {
      console.log();
    }
  }


  /**
   * @return {array} The array view of current board.
   */
  getArrayView() {
   const row = this.getBoard().length;
   const data = [];

    for (let i = 0; i < row; i++) {
      const currentRow = this.getBoard()[i];
      const rowData = [];

      for (let j = 0; j < currentRow.length; j++) {
        const cell = currentRow[j];
        rowData[j] = cell? cell.val : 0;
      }

      data[i] = rowData;
    }

    return data;
  }

  /**
   * getter
   * @return {Array} The grid data array.
   */
  getGrid() {
    return this.grid;
  }

  /**
   * getter
   * @return {Array} The board data array.
   */
  getBoard() {
    return this.board;
  }
}
