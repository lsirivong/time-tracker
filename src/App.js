import _ from 'lodash';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import parser from './lib/parser';
import Duration from './components/atom/Duration';

const keyCodes = {
  enter: 13,
  rightBracket: 221, // ']'
  leftBracket: 219, // '['
}

const styles = {
  logLine: {
    padding: '2px 2px'
  }
};

const appendStamp = val => (
  (/^$/g).test(val)
    ? `${val}${(new Date()).toISOString()} `
    : val
);

const setLog = (value, index, state) => {
  const newLogs = state.logs;
  const prevVal = newLogs[index];

  const newVal = (_.isEmpty(prevVal))
    ? `${(new Date()).toISOString()} ${value}`
    : value;
  newLogs[index] = appendStamp(newVal);
  return {
    logs: newLogs
  };
};

class App extends Component {
  state = {
    logs: ['']
  };

  // ref tracker
  logInputs = [];

  handleLogsChange = (index, e) => {
    this.setState(setLog.bind(this, e.target.value, index));
  }

  setFocus = (i) => {
    const activeIndex = typeof i === 'number'
      ? i
      : this.logInputs.length - 1;

    const input = this.logInputs[activeIndex];
    if (input) {
      input.focus();
    }
  }

  handleKeyDown = (i, e) => {
    switch (e.keyCode) {
      case keyCodes.enter: {
        this.setState(state => ({
          logs: state.logs.concat('')
        }), this.setFocus)
        break;
      }

      case keyCodes.leftBracket: {
        if (e.metaKey) {
          this.setState(state => {
            const newLogs = state.logs;
            const activeVal = newLogs[i];
            newLogs[i] = activeVal.replace(/^-/g, '');
            return {
              logs: newLogs
            };
          });
        }
        break;
      }

      case keyCodes.rightBracket: {
        if (e.metaKey) {
          this.setState(state => {
            const newLogs = state.logs;
            const activeVal = newLogs[i];
            newLogs[i] = `-${activeVal}`;
            return {
              logs: newLogs
            }
          })
        }
        break;
      }
    }
  }

  render() {
    const computed = parser.parseAndCompute(this.state.logs.join('\n'));
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome</h2>
        </div>
        <ol className="App-intro">
          {this.state.logs.map((log, i) => (
            <li className="Log-item" key={`log_${i}`}>
              <input
                type="text"
                className="Log-input"
                onChange={this.handleLogsChange.bind(this, i)}
                onKeyDown={this.handleKeyDown.bind(this, i)}
                ref={c => this.logInputs[i] = c}
                value={log}
                style={styles.logLine}
              />
              {' '}
              <Duration value={computed[i].duration} />
            </li>
          ))}
        </ol>
      </div>
    );
  }
}

export default App;
