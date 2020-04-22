import * as React from 'react';
import JSONTree from 'react-json-tree';

class JsonTreeViewer extends React.Component {
  renderJsonData() {
    return ( 
      <>
        <h1>{this.props.title}</h1>
        <JSONTree data={this.props.data} theme="bright" shouldExpandNode={this.props.shouldExpandNode} />
      </>
    );
  }

  render() {
    return this.renderJsonData();
  }
}

export default JsonTreeViewer;