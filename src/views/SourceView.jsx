import React from 'react';

class SourceView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="author_info">
      <div className="github">
        <span>
          Hand crafted by <a className="github_link" target="_blank" href="https://github.com/shogunsea">Shogunsea</a>
        </span>
      </div>

      <div className="source">
        <span>
          Source code <a className="github_project" target="_blank" href="https://github.com/shogunsea/react-2048">here</a>.
        </span>
      </div>
    </div>
  }
}

export default SourceView;
