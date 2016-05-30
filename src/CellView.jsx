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
    if (value == 2) {
      let b = 1;
    }
    const valClass = this.getValueClass(value);
    return  <div className={"cell " + valClass}></div>;
  }
}

export default CellView;
