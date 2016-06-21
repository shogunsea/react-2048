import React from 'react';

class CellView extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = '';
  }

  getValueClass(val) {
    if (val == 0) {
      return " ";
    } else {
      return "value-" + val + " ";
    }
  }

  showCellInfoInDevMode() {
    const info = {
      row: this.props.row,
      col: this.props.col,
      val: this.props.val,
      isNew: this.props.isNew,
      isGrid: this.props.isGrid
    };
    console.log(info);
  }

  render() {
    const value = this.props.val;
    const valClass = this.props.isNew? "new " + this.getValueClass(value) : this.getValueClass(value);
    const gridClass = this.props.isGrid? "grid " : " ";
    const position = "row_"+this.props.row+" col_"+this.props.col + " ";
    return  <div id={this.props.id} className={"cell " + valClass + position + " " + this.props.movement} onClick={this.showCellInfoInDevMode.bind(this)}>{this.props.val == 0? '' : this.props.val}</div>;
  }
}

export default CellView;
