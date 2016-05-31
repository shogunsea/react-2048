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

  render() {
    const value = this.props.val;
    const valClass = this.props.isNew? "new " + this.getValueClass(value) : this.getValueClass(value);
    return  <div className={"cell " + valClass}>{this.props.val == 0? '' : this.props.val}</div>;
  }
}

export default CellView;
