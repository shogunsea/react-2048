import _ from 'lodash';

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

    this.board = _.cloneDeep(this.grid);
  }

  /**
   * Checks if board has empty slots
   * @return {Boolean} Whether current board has empty slots.
   */
  hasEmptySlots() {
    const board = this.board;
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


  // Action
  updateScore(score) {
    this.score += score;
  }

  // Action
  mergeTwoCells(mergedIntoCell, mergedCell) {
    mergedIntoCell.val *= 2;
    this.updateScore(mergedIntoCell.val);
    this.recordMaxScore();

    // never ends please
    if (mergedIntoCell.val == 2048) {
      this.hasWon = true;
    }

    mergedIntoCell.shouldNotMergeAgain = true;

    if (mergedIntoCell.mergedInto) {
      mergedIntoCell.mergedIntoToggle = true;
      mergedIntoCell.mergedInto = false;
    } else if (mergedIntoCell.mergedIntoToggle) {
      mergedIntoCell.mergedInto = true;
      mergedIntoCell.mergedIntoToggle = false;
    } else {
      mergedIntoCell.mergedInto = true;
    }

    mergedCell.merged = true;
    mergedCell.mergedInto = false;
    mergedCell.mergedIntoToggle = false;
  }

  // Action
  // copy over the logic to move cells up here.
  moveCellsUp() {
    const direction = 'up';
    const board = this.getBoard();
    let boardHasMoved = false;
    // iterate through each column, move cells that will
    // hit the bound visually earlies first, i.e. start
    // from the top
    for (let j = 0; j < board.length; j++) {
      for (let i = 0; i < board.length; i++) {
        const currentRow = board[i];
        if (!currentRow[j]) {
          continue;
        }

        const curCell = currentRow[j];
        const preRow = curCell.curRow;
        let merged = false;
        let toRow = this.getReachableRow(curCell, direction);
        if (toRow > 0
          && board[toRow - 1][j]
          && board[toRow - 1][j].val == curCell.val
          && !board[toRow - 1][j].shouldNotMergeAgain) {
          this.mergeTwoCells(board[toRow - 1][j], curCell);
          toRow -= 1;
          merged = true;
        }

        let movement = '';

        curCell.fromRow = preRow;
        curCell.curRow = toRow;
        movement = 'row_from_' + preRow + '_to_' + toRow;
        curCell.movement = movement;

        const cellHasMoved = curCell.fromRow != curCell.curRow;

        const newRow = currentRow.map(function(cell) {
          if (!cell) {
            return;
          }
          if (cell.id != curCell.id) {
            return cell;
          }
        });

        // taking out the old cell
        if (cellHasMoved) {
          board[i] = newRow;
        }

        // setting new cell?
        if (curCell.merged) {
          board[toRow].push(curCell);
        } else {
          board[toRow][j] = curCell;
        }

        if (cellHasMoved && !merged) {
          curCell.mergedInto = false;
          curCell.mergedIntoToggle = false;
        }

        boardHasMoved |= cellHasMoved;
      }
    }

    return boardHasMoved;
  }

  // State/Board
  getReachableRow(curCell, direction) {
    const {curRow: row, curCol: col} = curCell;
    const board = this.getBoard();

    if (direction == 'up') {
      for (let i = row - 1; i >= 0; i--) {
        if (board[i][col]) {
          return i + 1;
        }
      }
      return 0;
    } else if (direction == 'down') {
      for (let i = row + 1; i < board.length; i++) {
        if (board[i][col]) {
          return i - 1;
        }
      }
      return 3;
    }
  }

  // State / Board
  getReachableCol(curCell, direction) {
    const {curRow: row, curCol: col} = curCell;
    const board = this.getBoard();

    if (direction == 'left') {
      for (let i = col - 1; i >= 0; i--) {
        if (board[row][i]) {
          return i + 1;
        }
      }
      return 0;
    } else if (direction == 'right') {
      for (let i = col + 1; i < board.length; i++) {
        if (board[row][i]) {
          return i - 1;
        }
      }
      return 3;
    }
  }


  getBoard() {
    return this.board;
  }
}
