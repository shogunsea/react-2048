const chalk = require('chalk');
const sampleBoards = require('../../test/stub/sample_boards.json');

/**
 * @param  {number} min - Lower inclusive bound
 * @param  {number} max - Upper inclusive bound
 * @return {number} Random integer value in [min, max]
 */
const getRandomIntInclusive = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const boardDataFetcher = function(board) {
  let boardName = '';
  if (board) {
    boardName = board.toLowerCase();
    console.log(chalk.green('loading board: ' + boardName));
  } else {
    return;
  }

  if (!sampleBoards[boardName]) {
    return;
  }

  const boardData = sampleBoards[boardName];

  return `window.__specifiedBoardData__ = ${JSON.stringify(boardData)};`;
};

const rotateMatrixClockwise = function(matrix, times) {
  const len = matrix.length;
  const tempBoard = [];

  for (let row = 0; row < len; row++) {
    const newRow = [];
    // for ith row, copy over all values from ith col
    for (let col = len - 1; col >= 0; col--) {
      newRow[len - 1 - col] = matrix[col][row];
    }
    tempBoard[row] = newRow;
  }

  return tempBoard;
};

module.exports = {
  boardDataFetcher,
  rotateMatrixClockwise,
  getRandomIntInclusive,
};
