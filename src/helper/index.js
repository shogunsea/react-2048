const chalk = require('chalk');

const sampleBoards = require('../../test/stub/sample_boards.json');

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
  const board = matrix;
  const len = matrix.length;
  const tempBoard = [];

  for (let i = 0; i < len; i++) {
    tempBoard.push(new Array(len));
  }

  // 1 2 3      7 4 1
  // 4 5 6 ---> 8 5 2
  // 7 8 9      9 6 3
  for (let i = 0; i < times; i++) {
    //       1 4 7
    // --->  2 5 8
    //       3 6 9
    for (let row = 0; row < len; row++) {
      for (let col = 0; col < len; col++) {
        const curCell = board[row][col];
        tempBoard[col][row] = curCell;
      }
    }
    //       7 4 1
    // --->  8 5 2
    //       9 6 3
    for (let row = 0; row < len; row++) {
      for (let col = 0; col < len / 2; col++) {
        const tempCell = tempBoard[row][col];
        tempBoard[row][col] = tempBoard[row][len - col];
        tempBoard[row][len - col] = tempCell;
      }
    }
  }

  console.log('????');

  for (let m = 0; m < len; m++) {
    for (let n = 0; n < len; n++) {
      matrix[m][n] = tempBoard[m][n];
    }
  }
};

module.exports = {boardDataFetcher, rotateMatrixClockwise};
