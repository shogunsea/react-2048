import _ from 'lodash';
import Cell from './cell.js';
import {rotateMatrixClockwise} from '../helper/index.js';

const BOARD_SIZE = 4;


/**
  Abstract board represents data model for very generic
  and simple board. It should be agnostic of what's the
  board would be used for.
*/

export default class AbstractBoard {
  constructor(boardData) {
    this.grid = [
      new Array(BOARD_SIZE),
      new Array(BOARD_SIZE),
      new Array(BOARD_SIZE),
      new Array(BOARD_SIZE),
    ];

    this.board = _.cloneDeep(this.grid);

    if (boardData) {
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
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
  }

  hasEmptySlots() {
    const board = this.board;
    let hasSlots = false;

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!board[i][j]) {
          hasSlots = true;
          return hasSlots;
        }
      }
    }

    return hasSlots;
  }

  // State/Board
  // check if there're two ajacent cells have same value
  // for each slot only checking right and down direction is enough
  hasMergeableSlots() {
    const board = this.board;
    let isMergeable = false;

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        let curCell = board[i][j];
        if (j !== BOARD_SIZE - 1) {
          let rightCell = board[i][j + 1];
          if (!!curCell && curCell.val === rightCell.val) {
            isMergeable = true;
            return isMergeable;
          }
        }
        if (i !== BOARD_SIZE - 1) {
          let bottomCell = board[i + 1][j];
          if (!!curCell && curCell.val === bottomCell.val) {
            isMergeable = true;
            return isMergeable;
          }
        }
      }
    }

    return isMergeable;
  }

  // State/Board
  isMovable() {
    return this.hasEmptySlots() || this.hasMergeableSlots();
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

  // Action
  moveBoardTowards(direction) {
    let hasMoved = false;
    switch (direction) {
      case 'up':
        hasMoved = this.moveCellsUp();
        break;
      case 'down':
        this.print('Before rotating twice:');
        this.board = rotateMatrixClockwise(this.board, 2);
        this.print('After rotating twice:');
        this.print('Before current board moving up:');
        hasMoved = this.moveCellsUp();
        this.print('After current board moving up:');
        this.board = rotateMatrixClockwise(this.board, 2);
        break;
      case 'left':
        this.board = rotateMatrixClockwise(this.board, 1);
        hasMoved = this.moveCellsUp();
        this.board = rotateMatrixClockwise(this.board, 3);
        break;
      case 'right':
        this.board = rotateMatrixClockwise(this.board, 3);
        hasMoved = this.moveCellsUp();
        this.board = rotateMatrixClockwise(this.board, 1);
        break;
      default:
        break;
    }

    return hasMoved;
  }

  // moveUpOrDown(direction) {
  //   const board = this.getBoard();
  //   let boardHasMoved = false;
  //   // iterate through each column, move cells that will
  //   // hit the bound visually earlies first, i.e. start
  //   // from the top
  //   for (let j = 0; j < board.length; j++) {
  //     // row
  //     if (direction == 'up') {
  //       // row starts from top
  //       for (let i = 0; i < board.length; i++) {
  //         const currentRow = board[i];
  //         if (!currentRow[j]) {
  //           continue;
  //         }

  //         const curCell = currentRow[j];
  //         const preRow = curCell.curRow;
  //         let merged = false;
  //         let toRow = this.getReachableRow(curCell, direction);
  //         if (toRow > 0
  //           && board[toRow - 1][j]
  //           && board[toRow - 1][j].val == curCell.val
  //           && !board[toRow - 1][j].shouldNotMergeAgain) {
  //           this.mergeTwoCells(board[toRow - 1][j], curCell);
  //           toRow -= 1;
  //           merged = true;
  //         }

  //         let movement = '';

  //         curCell.fromRow = preRow;
  //         curCell.curRow = toRow;
  //         movement = 'row_from_' + preRow + '_to_' + toRow;
  //         curCell.movement = movement;

  //         const cellHasMoved = curCell.fromRow != curCell.curRow;

  //         const newRow = currentRow.map(function(cell) {
  //           if (!cell) {
  //             return;
  //           }
  //           if (cell.id != curCell.id) {
  //             return cell;
  //           }
  //         });

  //         // taking out the old cell
  //         if (cellHasMoved) {
  //           board[i] = newRow;
  //         }

  //         // setting new cell?
  //         if (curCell.merged) {
  //           board[toRow].push(curCell);
  //         } else {
  //           board[toRow][j] = curCell;
  //         }

  //         if (cellHasMoved && !merged) {
  //           curCell.mergedInto = false;
  //           curCell.mergedIntoToggle = false;
  //         }

  //         boardHasMoved |= cellHasMoved;
  //       }
  //     } else {
  //       // rows starts from bottom
  //       for (let i = board.length - 1; i >= 0; i--) {
  //         const currentRow = board[i];
  //         if (!currentRow[j]) {
  //           continue;
  //         }
  //         const curCell = currentRow[j];
  //         const preRow = curCell.curRow;
  //         // const preCol = curCell.curCol;
  //         let toRow = this.getReachableRow(curCell, direction);
  //         let merged = false;

  //         // if mergable
  //         if (toRow < 3
  //           && board[toRow + 1][j]
  //           && board[toRow + 1][j].val == curCell.val
  //           && !board[toRow + 1][j].shouldNotMergeAgain) {
  //           this.mergeTwoCells(board[toRow + 1][j], curCell);
  //           toRow += 1;
  //           merged = true;
  //         }

  //         let movement = '';

  //         // curCell.fromCol = preCol;
  //         curCell.fromRow = preRow;
  //         curCell.curRow = toRow;
  //         movement = 'row_from_' + preRow + '_to_' + toRow;
  //         curCell.movement = movement;

  //         const cellHasMoved = curCell.fromRow != curCell.curRow;

  //         const newRow = currentRow.map(function(cell) {
  //           if (!cell) {
  //             return;
  //           }
  //           if (cell.id != curCell.id) {
  //             return cell;
  //           }
  //         });

  //         // taking out the old cell
  //         if (cellHasMoved) {
  //           board[i] = newRow;
  //         }

  //         // setting new cell?
  //         if (curCell.merged) {
  //           board[toRow].push(curCell);
  //         } else {
  //           board[toRow][j] = curCell;
  //         }

  //         if (cellHasMoved && !merged) {
  //           curCell.mergedInto = false;
  //           curCell.mergedIntoToggle = false;
  //         }

  //         boardHasMoved |= cellHasMoved;
  //       }
  //     }
  //   }

  //   return boardHasMoved;
  // }

  // moveLeftOrRight(direction) {
  //   const board = this.getBoard();
  //   let boardHasMoved = false;
  //   // row
  //   for (let i = 0; i < board.length; i++) {
  //     const curRow = board[i];
  //     if (curRow.length == 0) {
  //       continue;
  //     }
  //     // col
  //     if (direction == 'left') {
  //       // col starts from left
  //       for (let j = 0; j < board.length; j++) {
  //         const curCell = curRow[j];
  //         if (!curCell) {
  //           continue;
  //         }

  //         const preCol = curCell.curCol;
  //         let toCol = this.getReachableCol(curCell, direction);
  //         let movement = '';
  //         let merged = false;

  //         if (toCol > 0
  //           && curRow[toCol - 1]
  //           && curRow[toCol - 1].val == curCell.val
  //           && !curRow[toCol - 1].shouldNotMergeAgain) {
  //           this.mergeTwoCells(curRow[toCol - 1], curCell);
  //           toCol -= 1;
  //           merged = true;
  //         }

  //         curCell.fromCol = preCol;
  //         curCell.curCol = toCol;
  //         movement = 'col_from_' + preCol + '_to_' + toCol;
  //         curCell.movement = movement;

  //         const cellHasMoved = curCell.fromCol != curCell.curCol;
  //         if (cellHasMoved) {
  //           if (curCell.merged) {
  //             curRow.push(curCell);
  //           } else {
  //             curRow[curCell.curCol] = curCell;
  //           }
  //           curRow[j] = undefined;
  //         }

  //         if (cellHasMoved && !merged) {
  //           curCell.mergedInto = false;
  //           curCell.mergedIntoToggle = false;
  //         }

  //         boardHasMoved |= cellHasMoved;
  //       }
  //     } else if (direction == 'right') {
  //       // col starts from right
  //       for (let j = board.length - 1; j >= 0; j--) {
  //         const curCell = curRow[j];
  //         if (!curCell) {
  //           continue;
  //         }

  //         const preCol = curCell.curCol;
  //         let toCol = this.getReachableCol(curCell, direction);
  //         let movement = '';
  //         let merged = false;

  //         if (toCol < board.length - 1
  //           && curRow[toCol + 1]
  //           && curRow[toCol + 1].val == curCell.val
  //           && !curRow[toCol + 1].shouldNotMergeAgain) {
  //           this.mergeTwoCells(curRow[toCol + 1], curCell);
  //           toCol += 1;
  //           merged = true;
  //         }

  //         curCell.fromCol = preCol;
  //         curCell.curCol = toCol;
  //         movement = 'col_from_' + preCol + '_to_' + toCol;
  //         curCell.movement = movement;

  //         const cellHasMoved = curCell.fromCol != curCell.curCol;
  //         if (cellHasMoved) {
  //           if (curCell.merged) {
  //             curRow.push(curCell);
  //           } else {
  //             curRow[curCell.curCol] = curCell;
  //           }
  //           curRow[j] = undefined;
  //         }

  //         if (cellHasMoved && !merged) {
  //           curCell.mergedInto = false;
  //           curCell.mergedIntoToggle = false;
  //         }

  //         boardHasMoved |= cellHasMoved;
  //       }
  //     }
  //   }

  //   return boardHasMoved;
  // }

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

  // Board / State
  getScore() {
    return this.score;
  }
}
