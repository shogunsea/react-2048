import React, {Component} from 'react';
import ReactDom from 'react-dom';

class FailOverlay extends React.Component {
  render() {
    const wonText = 'Whoops! That\'s it! One more round?';
    const showOverlay = this.props.showOverlay;
    const clickHandler = this.props.clickHandler;
    const restartButton = <div className='restart button' onClick={clickHandler}>Play again</div>;
    const overLay = <div className='overlay_text'>{wonText}</div>;
    return <div className={'overlay ' + showOverlay}>
      {overLay}
      {restartButton}
    </div>;
  }
}

export default FailOverlay;
