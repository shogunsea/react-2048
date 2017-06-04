/*eslint-disable */

import {rotateMatrixClockwise} from '../helper/index.js';

// Action
const moveBoardTowards = function(direction) {
  debugger
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
}

export default class BoardAction {
  constructor() {

  }

  getMethods() {
    const getAction = function() {
      console.log('This is getAction method.');
    };

    const print = function(message = '', padding = 2) {
      const row = this.board.length;
      console.log(message);

      for (let i = 0; i < row; i++) {
        console.log(this.board[i]);
      }

      for (let j = 0; j < padding; j++) {
        console.log();
      }
    };

    return [getAction, print, moveBoardTowards];
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
