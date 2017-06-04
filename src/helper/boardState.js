
const getState = function() {
  console.log('This is getState method.');
};

// State/Board
const getReachableRow = function(curCell, direction) {
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
};

// State / Board
const getReachableCol = function(curCell, direction) {
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
};

/**
 * check if there're two ajacent cells have same value
 *   for each slot only checking right and down direction is enough
 * @state: complex
 * @return {Boolean} If there's two cells that can be merged.
 */
const hasMergeableSlots = function() {
  const board = this.board;
  const rowLen = board.length;
  let isMergeable = false;

  for (let i = 0; i < rowLen; i++) {
    const colLen = board[i].length;

    for (let j = 0; j < colLen; j++) {
      let curCell = board[i][j];
      if (j !== colLen - 1) {
        let rightCell = board[i][j + 1];
        if (!!curCell && curCell.val === rightCell.val) {
          isMergeable = true;
          return isMergeable;
        }
      }
      if (i !== rowLen - 1) {
        let bottomCell = board[i + 1][j];
        if (!!curCell && curCell.val === bottomCell.val) {
          isMergeable = true;
          return isMergeable;
        }
      }
    }
  }

  return isMergeable;
};


export default class BoardState {
  constructor() {

  }

  getMethods() {
    const methods = [
      getState,
      getReachableCol,
      getReachableRow,
      hasMergeableSlots,
    ];

    return methods;
  }

  decorate(boardInstance) {
    const methods = this.getMethods();
    // TODO: this might not be the right approach
    // since it's mutating the instance.
    // Question: how to properly extend JS prototype methods.
    for (let method of methods) {
      boardInstance[`${method.name}`] = method;
    }
  }
}
