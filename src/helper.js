

export function moveUpOrDown(direction) {
  console.log('direction: ' + direction);
  const board = this.getBoard();
  // col
  for (let j = 0; j < BOARD_SIZE; j++) {
    // row
    if (direction == 'up') {
      // row starts from top
      for (let i = 0; i < BOARD_SIZE; i++) {
        const curRow = board[i];
        if (!curRow[j]) {
          continue;
        }

        const curCell = curRow[j];
        const preRow = curCell.curRow;
        const preCol = curCell.curCol;
        let toRow = this.getReachableRow(curCell, direction);
        if (toRow > 0 && board[toRow - 1][j] && board[toRow - 1][j].val == curCell.val) {
          this.mergeTwoCells(board[toRow - 1][j], curCell);
          toRow -= 1;
          // curRow[j] = null;
          // continue;
        }

        let movement = '';

        curCell.fromCol = preCol;
        curCell.fromRow = preRow;
        curCell.curRow = toRow;
        movement = "row_from_" + preRow + "_to_" + toRow;
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
        const toRow = this.getReachableRow(curCell, direction);
        let movement = '';

        curCell.fromCol = preCol;
        curCell.fromRow = preRow;
        curCell.curRow = toRow;
        movement = "row_from_" + preRow + "_to_" + toRow;
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
    }
  }
}

export function moveLeftOrRight(direction){
  console.log('direction: ' + direction);
  const board = this.getBoard();
  for (let i = 0; i < BOARD_SIZE; i++) {
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

export function mergeTwoCells(cellA, cellB) {
  cellA.fromRow = -1;
  cellA.fromCol = -1;
  cellA.val *= 2;
  cellB.val = 0;
  cellB.merged = true;
}

export function getReachableRow(curCell, direction) {
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
