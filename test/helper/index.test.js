const {
  // boardDataFetcher,
  rotateMatrixClockwise,
} = require('../../src/helper/utils');

const {expect} = require('chai');

describe('Board helper file', () => {
  describe('#rotateMatrixClockwise', () => {
    context('when matrix is a 3*3 square', () => {
      beforeEach(() => {
        this.input = [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ];
        this.expectedOutputForOnce = [
          [7, 4, 1],
          [8, 5, 2],
          [9, 6, 3],
        ];
        this.expectedOutputForTwice = [
          [9, 8, 7],
          [6, 5, 4],
          [3, 2, 1],
        ];
        this.expectedOutputForThrice = [
          [3, 6, 9],
          [2, 5, 8],
          [1, 4, 7],
        ];
      });

      context('rotating once', () => {
        it('rotates the matrix correctly', () => {
          const output = rotateMatrixClockwise(this.input, 1);
          expect(this.expectedOutputForOnce).to.deep.equal(output);
        });
      });

      context('rotating twice', () => {
        it('rotates the matrix correctly', () => {
          const output = rotateMatrixClockwise(this.input, 2);
          expect(this.expectedOutputForTwice).to.deep.equal(output);
        });
      });

      context('rotating thrice', () => {
        it('rotates the matrix correctly', () => {
          const output = rotateMatrixClockwise(this.input, 3);
          expect(this.expectedOutputForThrice).to.deep.equal(output);
        });
      });
    });

    context('when matrix is a 4*4 square', () => {
      beforeEach(() => {
        this.input = [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 16],
        ];
        this.expectedOutputForOnce = [
          [13, 9, 5, 1],
          [14, 10, 6, 2],
          [15, 11, 7, 3],
          [16, 12, 8, 4],
        ];
        this.expectedOutputForTwice = [
          [16, 15, 14, 13],
          [12, 11, 10, 9],
          [8, 7, 6, 5],
          [4, 3, 2, 1],
        ];
        this.expectedOutputForThrice = [
          [4, 8, 12, 16],
          [3, 7, 11, 15],
          [2, 6, 10, 14],
          [1, 5, 9, 13],
        ];
      });

      context('rotating once', () => {
        it('rotates the matrix correctly', () => {
          const output = rotateMatrixClockwise(this.input, 1);
          expect(this.expectedOutputForOnce).to.deep.equal(output);
        });
      });

      context('rotating twice', () => {
        it('rotates the matrix correctly', () => {
          const output = rotateMatrixClockwise(this.input, 2);
          expect(this.expectedOutputForTwice).to.deep.equal(output);
        });
      });

      context('rotating thrice', () => {
        it('rotates the matrix correctly', () => {
          const output = rotateMatrixClockwise(this.input, 3);
          expect(this.expectedOutputForThrice).to.deep.equal(output);
        });
      });
    });

  //   context('when the matrix is a 3*4 rectangle', () => {
  //     beforeEach(() => {
  //       this.input = [[1,2,3,4],[5,6,7,8],[9,10,11,12]];
  //       this.expectedOutput = [[9,5,1],[10,6, 2],[11,7,3],[12,8,4]];
  //     });

  //     it('rotates the matrix correctly', () => {
  //       const output = rotateMatrixClockwise(this.input);
  //       expect(this.expectedOutput).to.deep.equal(output);
  //     });
  //   });

  //   context('when the matrix has different row size', () => {
  //     beforeEach(() => {
  //       this.input = [[1,2,3,4],[5,6,7,8],[9,10,11,12]];
  //       this.expectedOutput = [[9,5,1],[10,6, 2],[11,7,3],[12,8,4]];
  //     });

  //     it('rotates the matrix correctly', () => {
  //       const output = rotateMatrixClockwise(this.input);
  //       expect(this.expectedOutput).to.deep.equal(output);
  //     });
  //   });
  });
});
