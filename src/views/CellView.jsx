import React from 'react';

class CellView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cellProps: props};
  }

  getValueClass(val) {
    if (val == 0) {
      return ' ';
    } else {
      return 'value-' + val + ' ';
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // place holder for debugging double mergedInto animation issue
    if (this.props.row === 0 && this.props.col === 2 && this.props.val === 8) {
      // const b = 1;
      // debugger
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // place holder for debugging double mergedInto animation issue
    if (this.props.row === 0 && this.props.col === 2) {
      if (this.props.isMergedInto && nextProps.isMergedInto) {
        this.props.isMergedInto = false;
        // nextProps.isMergedInto = false;
        // const a = 1;
        // debugger
        // this.forceUpdate(function() {
        //   debugger
        //   const b = 1;
        //   this.props.isMergedInto = true;
        // });
      }
    }
  }

  showCellInfo() {
    const info = {
      row: this.props.row,
      col: this.props.col,
      fromRow: this.props.fromRow,
      fromCol: this.props.fromCol,
      val: this.props.val,
      isNew: this.props.isNew,
      isGrid: this.props.isGrid,
      isMerged: this.props.isMerged,
    };
    console.log(info);
  }

  render() {
    const value = this.props.val;
    const valClass = this.props.isNew? 'new ' + this.getValueClass(value) : this.getValueClass(value);
    const gridClass = this.props.isGrid? 'grid ' : ' ';
    const merged = this.props.isMerged? ' merged ' : ' ';
    const mergedInto = this.props.isMergedInto? ' mergedInto ' : ' ';
    const position = 'row_'+this.props.row+' col_'+this.props.col + ' ';
    return <div id={this.props.id} className={'cell ' + valClass + position + ' ' + this.props.movement + merged + mergedInto + gridClass} onClick={this.showCellInfo.bind(this)}>{this.props.val == 0? '' : this.props.val}</div>;
  }
}

export default CellView;
