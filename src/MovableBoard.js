
export default class MovableBoard {
  constructor() {
    this.grid = [new Array(4), new Array(4), new Array(4), new Array(4)];
    this.board = _.cloneDeep(this.grid);
    this.hasWon = false;
  }

  mergeTwoCells(mergedIntoCell, mergedCell) {
    mergedIntoCell.val *= 2;
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
  }

  moveUpOrDown(direction) {
    const board = this.getBoard();
    // col
    for (let j = 0; j < board.length; j++) {
      // row
      if (direction == 'up') {
        // row starts from top
        for (let i = 0; i < board.length; i++) {
          const curRow = board[i];
          if (!curRow[j]) {
            continue;
          }

          const curCell = curRow[j];
          const preRow = curCell.curRow;
          const preCol = curCell.curCol;
          let toRow = this.getReachableRow(curCell, direction);
          if (toRow > 0 && board[toRow - 1][j] && board[toRow - 1][j].val == curCell.val && !board[toRow - 1][j].shouldNotMergeAgain) {
            this.mergeTwoCells(board[toRow - 1][j], curCell);
            toRow -= 1;
          }

          let movement = '';

          curCell.fromCol = preCol;
          curCell.fromRow = preRow;
          curCell.curRow = toRow;
          movement = "row_from_" + preRow + "_to_" + toRow;
          curCell.movement = movement;

          const hasMoved = curCell.fromRow != curCell.curRow;

          const newRow = curRow.map(function(cell) {
            if (!cell) {
              return;
            }
            if (cell.id != curCell.id) {
              return cell;
            }
          })

          // taking out the old cell
          if (hasMoved) {
            board[i] = newRow;
          }

          // setting new cell?
          if (curCell.merged) {
            board[toRow].push(curCell);
          } else {
            board[toRow][j] = curCell;
          }

        }
      } else {
        // rows starts from bottom
        for (let i = board.length - 1; i >= 0; i--) {
          const curRow = board[i];
          if (!curRow[j]) {
            continue;
          }
          const curCell = curRow[j];
          const preRow = curCell.curRow;
          const preCol = curCell.curCol;
          let toRow = this.getReachableRow(curCell, direction);

          // if mergable
          if (toRow < 3 && board[toRow + 1][j] && board[toRow + 1][j].val == curCell.val && !board[toRow + 1][j].shouldNotMergeAgain) {
            this.mergeTwoCells(board[toRow + 1][j], curCell);
            toRow += 1;
          }

          let movement = '';

          curCell.fromCol = preCol;
          curCell.fromRow = preRow;
          curCell.curRow = toRow;
          movement = "row_from_" + preRow + "_to_" + toRow;
          curCell.movement = movement;

          const hasMoved = curCell.fromRow != curCell.curRow;

          const newRow = curRow.map(function(cell) {
            if (!cell) {
              return;
            }
            if (cell.id != curCell.id) {
              return cell;
            }
          })

          // taking out the old cell
          if (hasMoved) {
            board[i] = newRow;
          }

          // setting new cell?
          if (curCell.merged) {
            board[toRow].push(curCell);
          } else {
            board[toRow][j] = curCell;
          }

        }
      }
    }
  }

  moveLeftOrRight(direction){
    const board = this.getBoard();
    for (let i = 0; i < board.length; i++) {
      const curRow = board[i];
      if (curRow.length == 0) {
        continue;
      }

      if (direction == 'left') {
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
          const toCol = this.getReachableCol(curCell, direction);
          curCell.curCol = toCol;
          movement = "col_from_" + preCol + "_to_" + toCol;
          curCell.movement = movement;

          board[i][preCol] = null;
          board[i][toCol] = curCell;
        }
      } else if (direction == 'right') {
        for (let j = curRow.length - 1; j >= 0; j--) {
          const curCell = curRow[j];
          if (!curCell) {
            continue;
          }
          const preRow = curCell.curRow;
          const preCol = curCell.curCol;
          curCell.fromCol = preCol;
          curCell.fromRow = preRow;
          let movement = '';
          const toCol = this.getReachableCol(curCell, direction);
          curCell.curCol = toCol;
          movement = "col_from_" + preCol + "_to_" + toCol;
          curCell.movement = movement;

          board[i][preCol] = null;
          board[i][toCol] = curCell;
        }
      }
    }
  }



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

  getBoard(){
    return this.board;
  }
}