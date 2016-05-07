import React, {Component} from 'react';
import ReactDom from 'react-dom';

class BoardView extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = '';
    }

    render() {
        let title = 'BoardView';
        return <div className='board'>{title}</div>;
    }
}

export default BoardView;

ReactDom.render(<BoardView />, document.getElementById("box"))
