import React, {Component} from 'react';
import ReactDom from 'react-dom';
import RowView from './RowView.jsx';
import CellView from './CellView.jsx';
import Board from './Board.js';
import Cell from './Cell.js';

let AVAILABLE_INDEX = -1; // only four rounds during develpment
const KeyCodes = [37, 38, 39,40];

class BoardView extends React.Component {
  constructor(props) {
      super(props); // need props or not?
      this.board = new Board();
      this.addRandomCell();
      const rowView = this.mapRowModelToView(this.board.getRows());
      this.state = {rows: rowView}
  }

  updateStateWithRows(rows) {
    const rowView = this.mapRowModelToView(rows);
    this.setState({rows: rowView});
  }

  mapRowModelToView(rows) {
    let counter = 0;
    const rowView = rows.map((row) =>{
      return <RowView id={row.id} key={row.id} cells={row.cells}/>
    });
    return rowView;
  }

  getRandomCell() {
    const availableSlots = this.board.getAvailableSlots();
    const availableLength = availableSlots.length;

    if (availableLength == 0) {
      console.log('niet, you\'re dead ');
      return null;
    }

    const index = ~~(Math.random()* availableLength); // [0, availableLength - 1]
    const slot = availableSlots[index];
    const row = slot.row;
    const col = slot.col;
    const val = 2;
    const newCell = new Cell(row, col, val);
    return newCell;
  }

  addRandomCell() {
    const newCell = this.getRandomCell();
    this.board.addCellToBoard(newCell);
  }

  componentDidMount() {
    window.addEventListener('keyup', this.hanleKeyUp.bind(this));
  }

  hanleKeyUp(e) {
    const key = e.keyCode;
    if (KeyCodes.indexOf(key) != -1) {
      const direction = key - 37;
      // this.addRandomCell();
      this.board.moveBoard(direction);
      this.updateStateWithRows(this.board.rows);
    }
    if (key == 13) {
      this.createTestBoard();
    }
  }

  createTestBoard() {
    const testBoardRows = this.board.replaceWithTestBoard('board_A');
    this.updateStateWithRows(testBoardRows);
  }

  render() {
    return <div className='board'>
      {this.state.rows}
    </div>;
  }
}

export default BoardView;

ReactDom.render(<BoardView />, document.getElementById("container"))
