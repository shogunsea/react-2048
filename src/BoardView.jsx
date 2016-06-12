import React, {Component} from 'react';
import ReactDom from 'react-dom';
import RowView from './RowView.jsx';
import CellView from './CellView.jsx';
import BoardModel from './Board.js';
import Cell from './Cell.js';

let AVAILABLE_INDEX = -1; // only four rounds during develpment
const KeyCodes = [37, 38, 39,40];

class BoardView extends React.Component {
  constructor() {
      super(); // need props or not?
      this.board = new BoardModel();
      const rowView = this.mapRowModelToView(this.board.rows);
      this.state = {rows: rowView}
  }

  mapRowModelToView(rows) {
    let counter = 0;
    const rowView = rows.map((row) =>{
      return <RowView id={row.id} key={row.id} cells={row.cells}/>
    });
    return rowView;
  }

  getRandomCell() {
    const index = ~~(Math.random()* 16); // [0, 15]
    const row = ~~(index / 4);
    const col = index % 4;
    const val = 2;
    const newCell = new Cell(row, col, val);
    return newCell;
  }

  addRandomCell() {
    const newCell = this.getRandomCell();
    this.board.addCellToBoard(newCell);
    const rows = this.board.getRows();
    const rowView = this.mapRowModelToView(rows);
    this.setState({rows: rowView});
  }

  componentDidMount() {
    window.addEventListener('keyup', this.hanleKeyUp.bind(this));
  }

  hanleKeyUp(e) {
    if (KeyCodes.indexOf(e.keyCode) != -1) {
      const direction = e.keyCode - 37;
      this.addRandomCell();
    }
  }

  render() {
    return <div className='board'>
      {this.state.rows}
    </div>;
  }
}

export default BoardView;

ReactDom.render(<BoardView />, document.getElementById("container"))
