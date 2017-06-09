/*eslint-disable */

const {rotateMatrixClockwise} = require('../helper/utils.js');

/**
 * Generate a new Cell that been assigned value from
 *   available row and cols.
 * Set the new cell to the board.
 */
const addRandomCell = function() {
  const newCell = this.getRandomCell();
  this.setCellToBoard(newCell);
};

/**
 * @param {object} cell - The cell to be added on to the board
 *   according to the row&col value from cell properties.
 */
const setCellToBoard = function(cell) {
  if (!cell) {
    return;
  }
  const {curRow: row, curCol: col} = cell;
  this.getBoard()[row][col] = cell;
};


/**
 * TODO: number to string: doulbe switch condition
 *   really necessary? -- Fixed
 * TODO: Passing function as callback can reduce
 *   dependency? Consider to use more of such pattern?
 * TODO: is this method right place to trigger recordCurrentState?
 * @param  {number} direction - number that represents the direction
 * @param  {function} addRandomCell - the function that needs to be
 *   triggered to add a random number
 */

// takes input board in, output the moved board.
const moveBoard = function(direction, addRandomCell) {
  const hasMoved = this.moveBoardTowards(direction);

  if (hasMoved) {
    addRandomCell();
    this.recordCurrentState();
  }
};

/**
 * Receive direction, based on the direction temporarily rotate the board,
 *   move the cells up and restore the board.
 * @param  {string} direction - current direction board is moving towards
 */
const moveBoardTowards = function(direction) {
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
};

/**
 * move the cells upwards, merge if necessary
 */
const moveCellsUp = function() {
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
};

/**
 * @param  {Object} mergedIntoCell - the cell that absorb another cell and stays on
 *   the board
 * @param  {Object} mergedCell - the cell that has been merged and will visually
 *   disappear
 */
const mergeTwoCells = function(mergedIntoCell, mergedCell) {
  mergedIntoCell.val *= 2;
  this.updateScore(mergedIntoCell.val);
  this.recordMaxScore();

  // never ends please
  if (mergedIntoCell.val == 2048) {
    this.hasWon = true;
  }

  mergedIntoCell.shouldNotMergeAgain = true;

  /**
   * If host cell was also a host cell during last move, it should
   * also show the animation of 're-appear'.
   * Notes: this 'mergedintoToogle' attribtue was created because
   * I was having issues with React not triggering the animation
   * when it has detect that..?
   */
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
};

export default class BoardAction {
  constructor() {
  }

  getMethods() {
    const utilityAction = [
      mergeTwoCells,
      addRandomCell,
      setCellToBoard,
    ];

    const coreMovement = [
      moveBoardTowards,
      moveCellsUp,
      moveBoard,
    ];

    const methods = [...utilityAction, ...coreMovement];

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
