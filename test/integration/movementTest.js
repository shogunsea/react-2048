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

const twoCell = [
  [0, 2, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 2, 0],
  [0, 0, 0, 0],
];

// const twoCellMergeOnLeft = [
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [2, 0, 2, 0],
//   [0, 0, 0, 0],
// ];

// const twoCellMergeOnRight = [
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [2, 0, 2, 0],
//   [0, 0, 0, 0],
// ];

const twoCellMergeOnUp = [
  [0, 0, 0, 0],
  [0, 0, 2, 0],
  [0, 0, 2, 0],
  [0, 0, 0, 0],
];

// const twoCellMergeOnDown = [
//   [0, 0, 2, 0],
//   [0, 0, 0, 0],
//   [0, 0, 2, 0],
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
        this.board.moveBoard(this.movement, () => {});
        const array = this.board.getArrayView();
        expect(array).to.deep.equal(expectedBoard);
      });
    });

    context('Multiple cells', () => {
      context('Without merge', () => {
        beforeEach(() => {
          this.board.initWithBoardData(twoCell);
        });

        it('moves the board correctly', () => {
          const expectedBoard = [
            [0, 2, 2, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
          ];
          this.board.moveBoard(this.movement, () => {});
          const array = this.board.getArrayView();
          expect(array).to.deep.equal(expectedBoard);
        });
      });

      context('With merge', () => {
        beforeEach(() => {
          this.board.initWithBoardData(twoCellMergeOnUp);
        });

        it('moves the board correctly', () => {
          const expectedBoard = [
            [0, 0, 4, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
          ];
          this.board.moveBoard(this.movement, () => {});
          const array = this.board.getArrayView();
          this.board.print();
          expect(array).to.deep.equal(expectedBoard);
        });
      });
    });
  });

  describe.only('Moving down', () => {
    beforeEach(() => {
      this.movement = 'down';
    });

    context('Single cell', () => {
      beforeEach(() => {
        this.board.initWithBoardData(singleCellBoard);
      });

      it('moves the board correctly', () => {
        const expectedBoard = [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 2, 0],
        ];
        this.board.moveBoard(this.movement, () => {});
        const array = this.board.getArrayView();
        this.board.print();
        expect(array).to.deep.equal(expectedBoard);
      });
    });

  //   context('Multiple cells', () => {
  //     context('With merge', () => {

  //     });

  //     context('Without merge', () => {

  //     });
  //   });


  // });

  // describe('Moving left', () => {
  //   context('Single cell', () => {

  //   });

  //   context('Multiple cells', () => {
  //     context('With merge', () => {

  //     });

  //     context('Without merge', () => {

  //     });

  //   });

  // });

  // describe('Moving right', () => {
  //   context('Single cell', () => {

  //   });

  //   context('Multiple cells', () => {
  //     context('With merge', () => {

  //     });

  //     context('Without merge', () => {

  //     });
  //   });
  });
});
