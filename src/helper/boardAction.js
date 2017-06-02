/*eslint-disable */

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

    return [getAction, print];
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
