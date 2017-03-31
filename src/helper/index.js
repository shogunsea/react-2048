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

module.exports = {boardDataFetcher};
