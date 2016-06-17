import React from 'react';

class CellView extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = '';
  }

  getValueClass(val) {
    if (val == 0) {
      return "";
    } else {
      return "value-" + val;
    }
  }

  showCellInfoInDevMode() {
    const info = {
      row: this.props.rowId,
      col: this.props.colId,
      val: this.props.val,
      isNew: this.props.isNew
    };
    console.log(info);
  }

  render() {
    const value = this.props.val;
    const valClass = this.props.isNew? "new " + this.getValueClass(value) : this.getValueClass(value);
    const position = this.props.isGrid? "" : " row_"+this.props.rowId+" col_"+this.props.colId;
    return  <div id={this.props.rowId} className={"cell " + valClass + position} onClick={this.showCellInfoInDevMode.bind(this)}>{this.props.val == 0? '' : this.props.val}</div>;
  }
}

export default CellView;
