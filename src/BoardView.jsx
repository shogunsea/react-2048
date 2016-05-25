import React, {Component} from 'react';
import ReactDom from 'react-dom';
import RowView from './RowView.jsx';
import CellView from './CellView.jsx';
import BoardModel from './Board.js'

class BoardView extends React.Component {
  constructor(props) {
      super(props);
      this.displayName = '';
      let showTwoIndex = 2;
      let counter = 0;
      const board = new BoardModel();
      const rows = board.grid.map((row) =>{
        counter++;
        return <RowView id={row.id} key={row.id} showTwo={counter == showTwoIndex? true: false}/>
      });
      this.state = {rows: rows}
  }

  render() {
    return <div className='board'>
      {this.state.rows}
    </div>;
  }
}

export default BoardView;

ReactDom.render(<BoardView />, document.getElementById("container"))
