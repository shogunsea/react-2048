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
    const getState = function() {
      console.log('This is getState method.');
    };

    return [getState, hasMergeableSlots];
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
