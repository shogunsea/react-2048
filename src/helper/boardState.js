
export default class BoardState {
  constructor() {

  }

  getMethods() {
    const getState = function() {
      console.log('This is getState method.');
    };

    return [getState];
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
