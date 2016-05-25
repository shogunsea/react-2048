import React from 'react';
import CellView from './CellView.jsx';

class RowView extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = '';
  }

  render() {
    // let title = 'Tile View';
    return <div className="row">
    <CellView />
    <CellView showTwo={this.props.showTwo? true: false}/>
    <CellView />
    <CellView />
    </div>;
  }
}

export default RowView;
