
const {rotateMatrixClockwise} = require('../helper/utils.js');
const {pick} = require('lodash');

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
 * @param  {array} board - current board object.
 * @return {object} A collection of objects that are keyed on
 *   each cell's id, containing row/col indexes
 */
const getCellsIndexes = function(board) {
  const indexes = {};

  for (let row of board) {
    for (let elem of row) {
      if (elem) {
        // const {fromRow, fromCol, curRow, curCol, id} = elem;
        const record = pick(elem, 'fromRow', 'curRow', 'fromCol', 'curCol');
        indexes[`${elem.id}`] = record;
      }
    }
  }

  return indexes;
};

const updateCellState = function(cell, previousIndexes, curRow, curCol) {
  const record = previousIndexes[cell.id];
  const rowChagned = record.curRow !== curRow;
  const colChagned = record.curCol !== curCol;

  if (rowChagned) {
    cell.fromRow = record.curRow;
    cell.curRow = curRow;
    cell.fromCol = cell.curCol;
    cell.movement = 'row_from_' + cell.fromRow + '_to_' + cell.curRow;
  } else if (colChagned) {
    cell.fromCol = record.curCol;
    cell.curCol = curCol;
    cell.fromRow = cell.curRow;
    cell.movement = 'col_from_' + cell.fromCol + '_to_' + cell.curCol;
  } else {
    cell.movement = '';
  }
};

/**
 * @param  {array} board - current board object
 * @param  {object} previousIndexes - A collection of objects
 *   that stores the cell row/col info before board movement.
 */
const updateBoardState = function(board, previousIndexes) {
  const rowLen = board.length;

  for (let i = 0; i < rowLen; i++) {
    const curRow = board[i];
    const colLen = curRow.length;

    for (let j = 0; j < colLen; j++) {
      const curCell = board[i][j];

      if (curCell && previousIndexes[curCell.id]) {
        this.updateCellState(curCell, previousIndexes, i, j);

        if(curCell.childCell && previousIndexes[curCell.childCell.id]) {
          this.updateCellState(curCell.childCell, previousIndexes, i, j);
        }
      }
    }
  }
};

/**
 * Receive direction, based on the direction temporarily rotate the board,
 *   move the cells up and restore the board.
 * @param  {string} direction - current direction board is moving towards
 * @return {boolean} Whether or not the board has been moved.
 */
const moveBoardTowards = function(direction) {
  let hasMoved = false;
  const previousIndexes = this.getCellsIndexes(this.board);

  switch (direction) {
    case 'up':
      hasMoved = this.moveCellsUp();
      break;
    case 'down':
      this.board = rotateMatrixClockwise(this.board, 2);
      hasMoved = this.moveCellsUp();
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

  this.updateBoardState(this.board, previousIndexes);

  return hasMoved;
};

const cellToBeMerged = function(toRow, board, curCell, curCol) {
  const moveToFirstRow = toRow == 0;

  if (moveToFirstRow) {
    return false;
  }

  const preCell = board[toRow - 1][curCol];
  const preCellHasSameValue = preCell && preCell.val == curCell.val;
  const preCellValidForMerge = preCell && !preCell.shouldNotMergeAgain;
  const toBeMerged = preCellHasSameValue && preCellValidForMerge;

  return toBeMerged;
};

/**
 * Reset the attribute of current cell since
 *   a fresh movement is about to be handled.
 * @param  {object} cell - Current cell to be updated.
 */
const resetCellState = function(cell) {
  cell.mergedInto = false;
  cell.merged = false;
  cell.shouldNotMergeAgain = false;
  cell.isNew = false;
  cell.childCell = null;
};

/**
 * move the cells upwards, merge if necessary
 * @return {boolean} Whether or not the board has been moved.
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
      this.resetCellState(curCell);

      const preRow = i;
      let toRow = this.getReachableRow(preRow, j, direction);

      if (this.cellToBeMerged(toRow, board, curCell, j)) {
        this.mergeTwoCells(board[toRow - 1][j], curCell);
        toRow -= 1;
      }

      const cellHasMoved = preRow != toRow;

      if (cellHasMoved) {
      // taking out the old cell
        const newRow = currentRow.map(function(cell) {
          if (!cell) {
            return;
          }
          if (cell.id != curCell.id) {
            return cell;
          }
        });

        board[i] = newRow;
      }

      if (!curCell.merged) {
        board[toRow][j] = curCell;
      }

      boardHasMoved |= cellHasMoved;
    }
  }

  return boardHasMoved;
};

/**
 * @param  {Object} hostCell - the cell that absorb another cell and stays on
 *   the board
 * @param  {Object} guestCell - the cell that has been merged and will visually
 *   disappear
 */
const mergeTwoCells = function(hostCell, guestCell) {
  hostCell.val *= 2;
  this.updateScore(hostCell.val);
  this.recordMaxScore();

  if (hostCell.val == 2048) {
    this.hasWon = true;
  }

  hostCell.shouldNotMergeAgain = true;

  /**
   * If host cell was also a host cell during last move, it should
   * also show the animation of 're-appear'.
   * Notes: this 'mergedintoToogle' attribtue was created because
   * I was having issues with React not triggering the animation
   * when it has detect that if one component has the same class
   * as before --- even though other attribute of the component
   * has been updated.
   */
  /** !!!!!!!!!!!!!!!
   * New spec for re-appear animation:
   * should only check one attribute. If present then trigger the
   * re-appear. This attribute shouldn't be attached to the state
   * of a cell.  Rather it just should be a flag or boolean value,
   * which gets computed everytime.
   * The fewer states there are, the easier they're to maintain.
   *!!!!!!!!!!!!!!!
   */
  hostCell.mergedInto = true;
  guestCell.merged = true;

  /**
   * ****** Spec for 'childCell' feature. ***
   * hostCell should contain guestCell
   * So that during cell Attribute updating process
   * merged cell(guest cell) would have the right
   * col/row info thus correct movement
   */
  hostCell.childCell = guestCell;
};

export default class BoardAction {
  constructor() {
  }

  getMethods() {
    const utilityAction = [
      mergeTwoCells,
      addRandomCell,
      setCellToBoard,
      updateCellState,
      resetCellState,
    ];

    const coreMovement = [
      moveBoardTowards,
      moveCellsUp,
      moveBoard,
      cellToBeMerged,
      getCellsIndexes,
      updateBoardState,
    ];

    const methods = [...utilityAction, ...coreMovement];

    return methods;
  }

  decorate(boardInstance) {
    const methods = this.getMethods();

    for (let method of methods) {
      boardInstance[`${method.name}`] = method;
    }
  }
}
