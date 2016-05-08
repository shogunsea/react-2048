import React, {Component} from 'react';
import ReactDom from 'react-dom';
import TileView from './tileView.jsx';
import CellView from './cellView.jsx';



class BoardView extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = '';
    }

    render() {
        let title = 'BoardView';
        return <div className='board'>
            <TileView />
          {title}
        </div>;
    }
}

export default BoardView;

ReactDom.render(<BoardView />, document.getElementById("container"))
