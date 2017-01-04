import React, {Component} from 'react';
import ReactDom from 'react-dom';

class WinOverlay extends React.Component {
  render() {
    const wonText = 'You\'ve won the game of 2048! Hit enter or click button below to restart.';
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

export default WinOverlay;
