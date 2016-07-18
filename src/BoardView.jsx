import React, {Component} from 'react';
import ReactDom from 'react-dom';
import CellView from './CellView.jsx';
import Board from './Board.js';
import OverlayView from './Overlay.jsx'

const KeyCodes = [37, 38, 39,40];

class BoardView extends React.Component {
  constructor(props) {
      super(props); // need super with props if need to access attribute on 'this' inside constructor
      this.board = new Board();
      this.board.addRandomCell()
      const gridView = this.mapCellsToView(this.board.getGrid());
      const boardView = this.mapCellsToView(this.board.getBoard());
      this.state = {board: boardView, grid: gridView}
  }

  updateStateWithCells(cells) {
    const cellView = this.mapCellsToView(cells);
    this.setState({board: cellView});
  }

  mapCellsToView(cells) {
    const cellsViews = cells.map((row) =>{
      return row.map((cell) => {
        if (!cell) {
          return;
        }

        const cellView  = <CellView row={cell.curRow} col={cell.curCol} val={cell.val} key={cell.id} id={cell.id} isNew={cell.isNew()} isGrid={cell.isGrid()} movement={cell.movement} isMerged={cell.merged} isMergedInto={cell.mergedInto}  isMergedIntoToggle={cell.mergedIntoToggle} />;

        cell.shouldNotMergeAgain = false;

        return cellView;
      })
    });
    return cellsViews;
  }

  componentDidMount() {
    window.addEventListener('keyup', this.hanleKeyUp.bind(this));
  }

  hanleKeyUp(e) {
    const key = e.keyCode;
    if (key == 13) {
      this.createTestBoard();
    }
    if (this.board.hasWon) {
      return;
    }
    if (KeyCodes.indexOf(key) != -1) {
      const direction = key - 37;
      this.board.filterMergedCells();
      this.board.moveBoard(direction, this.board.addRandomCell.bind(this.board));
      this.updateStateWithCells(this.board.getBoard());
    }
  }

  clickHandler() {
    const keyUpEvent = {keyCode: 13};
    this.hanleKeyUp(keyUpEvent);
  }

  createTestBoard() {
    const testBoard = this.board.replaceWithTestBoard('board_F');
    this.updateStateWithCells(testBoard);
  }

  render() {
    const showOverlay = this.board.hasWon? 'show_overlay' : 'hide';
    return <div className={'board '}>
      {this.state.grid}
      {this.state.board}
      <OverlayView showOverlay={showOverlay} clickHandler={this.clickHandler.bind(this)}/>
    </div>;
  }
}

export default BoardView;

ReactDom.render(<BoardView />, document.getElementById("container"))
