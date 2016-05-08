import React, {Component} from 'react';
import ReactDom from 'react-dom';
import TileView from './tileView.jsx';
import CellView from './cellView.jsx';
import BoardModel from './board.js'

class BoardView extends React.Component {
  constructor(props) {
      super(props);
      this.displayName = '';
  }

  render() {
    let board = new BoardModel();
    let tiles = board.tiles.map((tile) =>{
      return <TileView id={tile.id} key={tile.id}/>
    });
    return <div className='board'>
      {tiles}
    </div>;
  }
}

export default BoardView;

ReactDom.render(<BoardView />, document.getElementById("container"))
