import React from 'react';

class ScoreView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const clickHandler = this.props.newGameClickHandler;
    return <div className="score">
      <div className="new-game button" onClick={clickHandler}> New Game </div>
      <div className="max-score button"> Max score: {this.props.maxScore}</div>
      <div className="current-score button"> Current score: {this.props.currentScore}</div>
    </div>;
  }
}

export default ScoreView;
