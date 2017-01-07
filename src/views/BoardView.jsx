import React, {Component} from 'react';
import ReactDom from 'react-dom';
import Board from '../Board.js';
import CellView from './CellView.jsx';
import ScoreView from './ScoreView.jsx';
import WinOverlayView from './WinOverlay.jsx';
import FailOverlayView from './FailOverlay.jsx';
const KeyCodes = [37, 38, 39,40];

class BoardView extends React.Component {
  constructor(props) {
      super(props); // need super with props if need to access attribute on 'this' inside constructor
      this.board = new Board();
      this.board.addRandomCell();
      const gridView = this.mapCellsToView(this.board.getGrid());
      const boardView = this.mapCellsToView(this.board.getBoard());
      const touchStart = { x: null, y: null};
      const touchEnd = {x: null, y: null};
      this.state = {board: boardView, grid: gridView, touchStart, touchEnd};
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
    document.addEventListener('keyup', this.hanleKeyUp.bind(this));
    document.addEventListener('touchstart', this.handleTouchStart.bind(this));
    document.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  isRestartButton(eventTarget) {
    const listOfMatchedElements = [...document.querySelectorAll('.restart.button')];

    return listOfMatchedElements.indexOf(eventTarget) !== -1;
  }

  handleTouchStart(e) {
    if (this.isRestartButton(e.target)) {
      // if clicking on the restart button, then do not
      // handle it as touch event
      return e.target.click();
    }

    e.preventDefault();
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    const touchStart = {x, y};
    this.setState({touchStart: touchStart});
  }

  handleTouchEnd(e) {
    if (this.isRestartButton(e.target)) {
      return;
    }

    e.preventDefault();
    const touch = e.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    const prePos = this.state.touchStart;
    const xd = x - prePos.x;
    const yd = y - prePos.y;
    const xAbs = Math.abs(xd);
    const yAbs = Math.abs(yd);
    let keyCode = 0;

    if (xAbs > yAbs) {
      if (xd > 0) {
        // direction = 'right';
        keyCode = 39;
      }else {
        // direction = 'left';
        keyCode = 37;
      }
    } else {
      if (yd > 0) {
        // direction = 'top';
        keyCode = 40;

      } else {
        // direction = 'down';
        keyCode = 38;
      }
    }

    this.hanleKeyUp({keyCode});
  }

  hanleKeyUp(e, newGame) {
    if (newGame) {
      this.board = new Board();
      this.board.addRandomCell();
      this.updateStateWithCells(this.board.getBoard());
      return;
    }

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
      let isInitiallyMovable = this.board.isMovable();
      // move the board if movable
      if (isInitiallyMovable) {
        this.board.moveBoard(direction, this.board.addRandomCell.bind(this.board));
      }
      // after the movement the board may become unmovable
      let postMovementMovable = this.board.isMovable();

      if (!isInitiallyMovable || !postMovementMovable) {
        this.board.hasLost = true;
      }

      this.updateStateWithCells(this.board.getBoard());
    }
  }

  clickHandler() {
    this.hanleKeyUp(null, true);
  }

  createTestBoard() {
    const testBoard = this.board.replaceWithTestBoard('one_step_to_win');
    this.updateStateWithCells(testBoard);
  }

  render() {
    const showWinOverlay = this.board.hasWon? 'show_overlay' : 'hide';
    const showFailOverlay = this.board.hasLost? 'show_overlay' : 'hide';
    const currentScore = this.board.score;
    let maxScore = 0;
    if (document.cookie.indexOf('2048-max-score') !== -1) {
      maxScore = +document.cookie.match(/2048-max-score=(\d+)/)[1];
    }
    return <div className="game-view">
        <ScoreView currentScore={currentScore} maxScore={maxScore} />
        <div className={'board '}>
          {this.state.grid}
          {this.state.board}
          <WinOverlayView showOverlay={showWinOverlay} clickHandler={this.clickHandler.bind(this)}/>
          <FailOverlayView showOverlay={showFailOverlay} clickHandler={this.clickHandler.bind(this)}/>
        </div>
      </div>
  }
}

export default BoardView;

ReactDom.render(<BoardView />, document.getElementById("container"))
