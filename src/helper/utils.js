const chalk = require('chalk');
const {clone} = require('lodash');
const sampleBoards = require('../../test/stub/sample_boards.json');

/**
 * @param  {number} keyCode - Integer representation of key been pressed
 * @return {string} String value of detected direction.
 */
const parseDirection = function(keyCode) {
  let direction = '';

  switch(keyCode) {
    case 37:
      direction = 'left';
      break;
    case 38:
      direction = 'up';
      break;
    case 39:
      direction = 'right';
      break;
    case 40:
      direction = 'down';
      break;
  }

  return direction;
};

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

const rotateMatrixClockwise = function(matrix, times = 1) {
  const len = matrix.length;
  let tempBoard = clone(matrix);
  let finalBoard = [];

  for (let i = 0; i < times; i++) {
    for (let row = 0; row < len; row++) {
      const newRow = [];
      // for ith row, copy over all values from ith col
      for (let col = len - 1; col >= 0; col--) {
        newRow[len - 1 - col] = tempBoard[col][row];
      }
      finalBoard[row] = newRow;
    }

    tempBoard = clone(finalBoard);
  }

  return finalBoard;
};

module.exports = {
  boardDataFetcher,
  rotateMatrixClockwise,
  getRandomIntInclusive,
  parseDirection,
};
