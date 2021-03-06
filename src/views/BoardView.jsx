import React from 'react';
import ReactDom from 'react-dom';
import Board from '../model/board.js';
import CellView from './cellView.jsx';
import ScoreView from './scoreView.jsx';
import SourceView from './sourceView.jsx';
import WinOverlayView from './winOverlay.jsx';
import FailOverlayView from './failOverlay.jsx';
import {parseDirection} from '../helper/utils';

const directionKeyCodes = [37, 38, 39, 40];

class BoardView extends React.Component {
  constructor(props) {
      super(props); // need super with props if need to access attribute on 'this' inside constructor
      const previousBoard = this.getStoredBoard();
      const previousScore = this.getStoredScore();

      const querySpecifiedBoard = document.querySelectorAll('#board_data').length === 1;

      // if specified in querystring which board to load
      if (querySpecifiedBoard) {
        const boardData = window.__specifiedBoardData__;
        this.board = new Board(boardData);
        this.board.score = 0;
      } else if (previousBoard) {
        // if previosu board exists, then re-contrcut the board form it
        this.board = previousBoard;
        this.board.score = previousScore;
      } else {
        // else: create a new board and initialize with a random cell
        this.board = new Board();
        this.board.addRandomCell();
      }

      const gridView = this.mapBoardOfCellsToView(this.board.getGrid());
      const boardView = this.mapBoardOfCellsToView(this.board.getBoard());
      const touchStart = {x: null, y: null};
      const touchEnd = {x: null, y: null};
      this.state = {board: boardView, grid: gridView, touchStart, touchEnd};
  }

  getStoredScore() {
    if (document.cookie.indexOf('2048-stored-score') === -1) {
      return;
    }

    const storedScore = +document.cookie.match(/2048-stored-score=(\d+)/)[1];

    return storedScore;
  }

  getStoredBoard() {
    // read from cookie
    if (document.cookie.indexOf('2048-stored-board') === -1) {
      return;
    }

    const boardString = document.cookie.match(/2048-stored-board=((\d+,\d+,\d+,\d+,!)+)/)[1];
    const rows = boardString.split('!').filter((elem) => {
 return elem;
});
    const boardData = [];

    for (let i = 0; i < rows.length; i++) {
      const scoresInRow = rows[i].split(',').filter((elem) => {
 return elem;
});
      boardData[i] = scoresInRow;
    }

    return new Board(boardData);
  }

  updateStateWithCells(cells) {
    const cellView = this.mapBoardOfCellsToView(cells);
    this.setState({board: cellView});
  }

  mapCellView(cell) {
    return <CellView fromRow={cell.fromRow} fromCol={cell.fromCol} row={cell.curRow} col={cell.curCol} val={cell.val} key={cell.id} id={cell.id} isNew={cell.isNew} isGrid={cell.isGrid()} movement={cell.movement} isMerged={cell.merged} isMergedInto={cell.mergedInto} />;
  }

  mapBoardOfCellsToView(cells) {
    const cellsViews = cells.map((row) =>{
      return row.map((cell) => {
        if (!cell) {
          return;
        }

        const cellView = this.mapCellView(cell);

        if (cell.childCell) {
          const childCellView = this.mapCellView(cell.childCell);
          return [childCellView, cellView];
        }

        return cellView;
      });
    });

    return cellsViews;
  }

  componentDidMount() {
    document.addEventListener('keyup', this.hanleKeyUp.bind(this));

    const touchPanel = document.querySelectorAll('.touch-panel')[0];

    touchPanel.addEventListener('touchstart', this.handleTouchStart.bind(this));
    touchPanel.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  shouldBeClickable(eventTarget) {
    const listOfMatchedElements = [...document.querySelectorAll('.restart.button, .github_link, .github_project')];

    return listOfMatchedElements.indexOf(eventTarget) !== -1;
  }

  handleTouchStart(e) {
    e.preventDefault();

    if (this.shouldBeClickable(e.target)) {
      // if clicking on the restart button, then do not
      // handle it as touch event
      return e.target.click();
    }

    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    const touchStart = {x, y};
    this.setState({touchStart: touchStart});
  }

  handleTouchEnd(e) {
    if (this.shouldBeClickable(e.target)) {
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
    if (directionKeyCodes.indexOf(key) != -1) {
      // const direction = key - 37;
      const direction = parseDirection(key);
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
    const event = null;
    const newGame = true;
    this.hanleKeyUp(event, newGame);
  }

  createTestBoard() {
    const testBoard = this.board.replaceWithTestBoard('all_values');
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
        <ScoreView currentScore={currentScore} maxScore={maxScore} newGameClickHandler={this.clickHandler.bind(this)} />
        <div className={'touch-panel'}>
          <div className={'board '}>
            {this.state.grid}
            {this.state.board}
            <WinOverlayView showOverlay={showWinOverlay} clickHandler={this.clickHandler.bind(this)}/>
            <FailOverlayView showOverlay={showFailOverlay} clickHandler={this.clickHandler.bind(this)}/>
          </div>
        </div>
        <SourceView />
      </div>;
  }
}

export default BoardView;

ReactDom.render(<BoardView />, document.getElementById('container'));
