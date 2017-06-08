import {expect} from 'chai';
import Board from '../../src/model/board';
/**
 * Given input boards, when certain movement
 * has been triggered upton the board, the board
 * should end up as the expected board.
 */

/**
 * This meaning the input/output of board movement should
 * be complete independent of other parts of model/view
 */
const singleCellBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 2, 0],
  [0, 0, 0, 0],
];

// const twoCell = [
//   [0, 2, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 2, 0],
//   [0, 0, 0, 0],
// ];

// const twoCellMerge = [
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [2, 0, 2, 0],
//   [0, 0, 0, 0],
// ];

describe.only('Board Movement', () => {
  beforeEach(() => {
    this.board = new Board();
    global.document = {};
  });


  describe('Moving up', () => {
    beforeEach(() => {
      this.movement = 'up';
    });

    context('Single cell', () => {
      beforeEach(() => {
        this.board.initWithBoardData(singleCellBoard);
      });

      it('moves the board correctly', () => {
        const expectedBoard = [
          [0, 0, 2, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        this.document = {};
        this.board.moveBoard('up', () => {});
        const array = this.board.getArrayView();
        expect(array).to.deep.equal(expectedBoard);
      });
    });

    // context('Multiple cells', function() {
    //   context('With merge', function() {

    //   });

    //   context('Without merge', function() {

    //   });
    // });
  });

  // describe('Moving down', function() {
  //   context('Single cell', function() {

  //   });

  //   context('Multiple cells', function() {
  //     context('With merge', function() {

  //     });

  //     context('Without merge', function() {

  //     });
  //   });


  // });

  // describe('Moving left', function() {
  //   context('Single cell', function() {

  //   });

  //   context('Multiple cells', function() {
  //     context('With merge', function() {

  //     });

  //     context('Without merge', function() {

  //     });

  //   });

  // });

  // describe('Moving right', function() {
  //   context('Single cell', function() {

  //   });

  //   context('Multiple cells', function() {
  //     context('With merge', function() {

  //     });

  //     context('Without merge', function() {

  //     });
  //   });

  // });
});