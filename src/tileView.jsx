import React from 'react';
import CellView from './cellView.jsx';

class TileView extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = '';
  }

  render() {
    // let title = 'Tile View';
    return <div className="tile">
    <CellView />
    <CellView />
    <CellView />
    <CellView />
    </div>;
  }
}

export default TileView;
