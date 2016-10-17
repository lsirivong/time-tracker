import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import parser from './lib/parser';

class App extends Component {
  state = {
    logs: ''
  };

  appendStamp = val => (
    (/\n$/g).test(val)
      ? `${val}${(new Date()).toISOString()} `
      : val
  )

  handleLogsChange = e => {
    this.setState({
      logs: this.appendStamp(e.target.value)
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome</h2>
        </div>
        <p className="App-intro">
          <textarea
            onChange={this.handleLogsChange}
            value={this.state.logs}
            style={{
              width: '600px',
              height: '600px',
            }}
          />
        </p>
        <code style={{ textAlign : 'left' }}>
          <pre>
            {JSON.stringify(
              parser.parseAndCompute(this.state.logs),
              null,
              2
            )}
          </pre>
        </code>
      </div>
    );
  }
}

export default App;
