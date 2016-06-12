import React from 'react';
import CellView from './CellView.jsx';

class RowView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cells = this.props.cells;
    const cellsView = cells.map((cell) => {
      return <CellView rowId={cell.curRow} colId={cell.curCol} val={cell.val} key={cell.id} isNew={cell.isNew()} isGrid={cell.isGrid()} />
    })
    return <div className="row">
      {cellsView}
    </div>;
  }
}

export default RowView;
