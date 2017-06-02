const {boardDataFetcher, rotateMatrixClockwise} = require('../../src/helper/index');
const {expect} = require('chai');

describe('Board helper file', () => {
  describe('#rotateMatrixClockwise', () => {
    context('when matrix is a 3*3 square', () => {
      beforeEach(() => {
        this.input =  [[1,2,3,],[4,5,6],[7,8,9]];
        this.expectedOutput = [[7,4,1,],[8,5,2,],[9,6,3]];
      });

      it('rotates the matrix correctly', () => {
        const output = rotateMatrixClockwise(this.input);
        expect(this.expectedOutput).to.deep.equal(output);
      });
    });

    context('when matrix is a 4*4 square', () => {
      beforeEach(() => {
        this.input = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];
        this.expectedOutput = [[13,9,5,1],[14,10,6,2],[15,11,7,3],[16,12,8,4]];
      });

      it('rotates the matrix correctly', () => {
        const output = rotateMatrixClockwise(this.input);
        expect(this.expectedOutput).to.deep.equal(output);
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
  })
});
