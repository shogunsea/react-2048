
export default class MovableBoard {
  constructor() {
    this.grid = [new Array(4), new Array(4), new Array(4), new Array(4)];
    this.board = _.cloneDeep(this.grid);
    this.hasWon = false;
  }

  mergeTwoCells(mergedIntoCell, mergedCell) {
    mergedIntoCell.val *= 2;
    // never end please
    if (mergedIntoCell.val == 20480000) {
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

  moveUpOrDown(direction) {
    const board = this.getBoard();
    let boardHasMoved = false;
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
          let merged = false;
          let toRow = this.getReachableRow(curCell, direction);
          if (toRow > 0 && board[toRow - 1][j] && board[toRow - 1][j].val == curCell.val && !board[toRow - 1][j].shouldNotMergeAgain) {
            this.mergeTwoCells(board[toRow - 1][j], curCell);
            toRow -= 1;
            merged = true;
          }

          let movement = '';

          curCell.fromRow = preRow;
          curCell.curRow = toRow;
          movement = "row_from_" + preRow + "_to_" + toRow;
          curCell.movement = movement;

          const cellHasMoved = curCell.fromRow != curCell.curRow;

          const newRow = curRow.map(function(cell) {
            if (!cell) {
              return;
            }
            if (cell.id != curCell.id) {
              return cell;
            }
          })

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
          let merged = false;

          // if mergable
          if (toRow < 3 && board[toRow + 1][j] && board[toRow + 1][j].val == curCell.val && !board[toRow + 1][j].shouldNotMergeAgain) {
            this.mergeTwoCells(board[toRow + 1][j], curCell);
            toRow += 1;
            merged = true;
          }

          let movement = '';

          curCell.fromCol = preCol;
          curCell.fromRow = preRow;
          curCell.curRow = toRow;
          movement = "row_from_" + preRow + "_to_" + toRow;
          curCell.movement = movement;

          const cellHasMoved = curCell.fromRow != curCell.curRow;

          const newRow = curRow.map(function(cell) {
            if (!cell) {
              return;
            }
            if (cell.id != curCell.id) {
              return cell;
            }
          })

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
    }

    return boardHasMoved;
  }

  moveLeftOrRight(direction){
    const board = this.getBoard();
    let boardHasMoved = false;
    // row
    for (let i = 0; i < board.length; i++) {
      const curRow = board[i];
      if (curRow.length == 0) {
        continue;
      }
      // col
      if (direction == 'left') {
        // col starts from left
        for (let j = 0; j < board.length; j++) {
          const curCell = curRow[j];
          if (!curCell) {
            continue;
          }

          const preCol = curCell.curCol;
          let toCol = this.getReachableCol(curCell, direction);
          let movement = '';
          let merged = false;

          if (toCol > 0 && curRow[toCol - 1] && curRow[toCol - 1].val == curCell.val && !curRow[toCol - 1].shouldNotMergeAgain) {
            this.mergeTwoCells(curRow[toCol - 1], curCell);
            toCol -= 1;
            merged = true;
          }

          curCell.fromCol = preCol;
          curCell.curCol = toCol;
          movement = "col_from_" + preCol + "_to_" + toCol;
          curCell.movement = movement;

          const cellHasMoved = curCell.fromCol != curCell.curCol;
          if (cellHasMoved) {
            if (curCell.merged) {
              curRow.push(curCell);
            } else {
              curRow[curCell.curCol] = curCell;
            }
            curRow[j] = undefined;
          }

          if (cellHasMoved && !merged) {
            curCell.mergedInto = false;
            curCell.mergedIntoToggle = false;
          }

          boardHasMoved |= cellHasMoved;
        }

      } else if (direction == 'right') {
        // col starts from right
        for (let j = board.length - 1; j >= 0; j--) {
          const curCell = curRow[j];
          if (!curCell) {
            continue;
          }

          const preCol = curCell.curCol;
          let toCol = this.getReachableCol(curCell, direction);
          let movement = '';
          let merged = false;

          if (toCol < board.length - 1 && curRow[toCol + 1] && curRow[toCol + 1].val == curCell.val && !curRow[toCol + 1].shouldNotMergeAgain) {
            this.mergeTwoCells(curRow[toCol + 1], curCell);
            toCol += 1;
            merged = true;
          }

          curCell.fromCol = preCol;
          curCell.curCol = toCol;
          movement = "col_from_" + preCol + "_to_" + toCol;
          curCell.movement = movement;

          const cellHasMoved = curCell.fromCol != curCell.curCol;
          if (cellHasMoved) {
            if (curCell.merged) {
              curRow.push(curCell);
            } else {
              curRow[curCell.curCol] = curCell;
            }
            curRow[j] = undefined;
          }

          if (cellHasMoved && !merged) {
            curCell.mergedInto = false;
            curCell.mergedIntoToggle = false;
          }

          boardHasMoved |= cellHasMoved;
        }
      }
    }

    return boardHasMoved;
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