import React from 'react';

class CellView extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = '';
    }

    render() {
        // let title = 'Cell View'
        if(this.props.showTwo)
          return <div className="cell"></div>;
        else
          return <div className="cell two"></div>;
    }
}

export default CellView;
