import React from 'react';
import CellView from './CellView.jsx';

class RowView extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = '';
  }

  render() {
    const cells = this.props.cells;
    const cellsView = cells.map((cell) => {
      return <CellView val={cell.val} key={cell.id} />
    })
    return <div className="row">
      {cellsView}
    </div>;
  }
}

export default RowView;
