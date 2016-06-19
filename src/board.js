import Row from './Row.js';
import _ from 'lodash';
import Cell from './Cell.js';
import SampleBoards from '../test/stub/sample_boards.json';

const BOARD_SIZE = 4;

export default class Board {
  constructor(){
    this.rows = [];
    for(let i = 0; i < BOARD_SIZE; i++) {
      this.rows.push(new Row());
    }
  }

  replaceWithTestBoard(boardName = 'board_A') {
    this.constructor();
    const sampleBoard = SampleBoards[boardName];

    for (let i = 0; i < BOARD_SIZE; i++) {
      const curRow = sampleBoard[i];
      for (let j = 0; j < BOARD_SIZE; j++) {
        const val = curRow[j];
        if (val != 0) {
          const cell = new Cell(i, j, val);
          this.addCellToBoard(cell);
        }
      }
    }

    return this.getRows();
  }

  addCellToBoard(cell) {
    if (!cell) {
      return;
    }
    const {curRow: row, curCol: col} = cell;
    this.getRow(row).addCell(cell);
  }

  getAvailableSlots() {
    const slots = [];
    const rows = this.getRows();

    for (let i = 0 ; i < BOARD_SIZE; i++) {
      slots.push([0,0,0,0]);
    }

    for(let i = 0; i < rows.length; i++) {
      const curRow = rows[i];
      // there will always be 4 empty grid in each row
      for (let j = 4; j < curRow.cells.length; j++) {
        const curCell = curRow.cells[j];
        if (curCell) {
          slots[curCell.curRow][curCell.curCol] = 1;
        }
      }
    }

    const availableSlots = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (slots[i][j] == 0) {
          availableSlots.push({row: i, col: j})
        }
      }
    }

    return availableSlots;
  }

  moveBoard(direction) {
    switch(direction) {
      case 0:
        this.moveWithinRow('left');
        // this.moveLeft();
        break;
      case 1:
        this.moveAcrossRow('up');
        // this.moveUp();
        break;
      case 2:
        this.moveWithinRow('right');
        // this.moveRight();
        break;
      case 3:
        this.moveAcrossRow('down');
        // this.moveDown();
        break;
    }
  }

  moveAcrossRow(direction) {
    const rows = this.getRows();
    for( let i = 4; i < 8; i++) {// 4 cells maximum
      for (let j = 0; j < rows.length; j++) {
        const curRow = rows[j].cells;
        if (i >= curRow.length) {
          continue;
        }
        const curCell = curRow[i];
        const preRow = curCell.curRow;
        const preCol = curCell.curCol;
        curCell.fromCol = preCol;
        curCell.fromRow = preRow;
        let movement = '';
        if (direction == 'up') {
          curCell.curRow = 0;
          movement = "row_from_" + preRow + "_to_" + 0;
          curCell.movement = movement;
          const newRow = curRow.filter(function(cell) {
            return cell.id != curCell.id;
          })
          rows[j].cells = newRow;
          rows[0].cells.push(curCell);
        } else {
          curCell.curRow = 3;
          movement = "row_from_" + preRow + "_to_" + 3;
          curCell.movement = movement;
          const newRow = curRow.filter(function(cell) {
            return cell.id != curCell.id;
          })
          rows[j].cells = newRow;
          rows[3].cells.push(curCell);
        }

      }
    }
  }

  moveWithinRow(direction){
    const rows = this.getRows();
    for (let i = 0; i < rows.length; i++) {
      const curRow = rows[i];
      // simple case: single cell movement, no merge
      for (let j = 4; j < curRow.cells.length; j++) {
        const curCell = curRow.cells[j];
        const preRow = curCell.curRow;
        const preCol = curCell.curCol;
        curCell.fromCol = preCol;
        curCell.fromRow = preRow;
        let movement = '';
        if (direction == 'left') {
          curCell.curCol = 0;
          movement = "col_from_" + preCol + "_to_" + 0;
        } else if(direction == 'right') {
          curCell.curCol = 3;
          movement = "col_from_" + preCol + "_to_" + 3;
        } else if (direction == 'up') {
          curCell.curRow = 0;
          movement = "row_from_" + preRow + "_to_" + 0;
        } else {
          debugger
          curCell.curRow = 3;
          movement = "row_from_" + preRow + "_to_" + 3;
        }

        curCell.movement = movement;
      }

    }

  }

  swapTwoCells(cellA, cellB) {
    const tempRow = cellA.curRow;
    const tempCol = cellA.curCol;

  }

  mergeTwoCells(cellA, cellB) {

  }

  getRow(row) {
    return this.rows[row];
  }

  getRows(){
    return this.rows;
  }
}
