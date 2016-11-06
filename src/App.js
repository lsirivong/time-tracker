import _ from 'lodash';
import React, { Component } from 'react';
import moment from 'moment';
import parser from './lib/parser';
import TagSummary from './components/atom/TagSummary/';
import LogEntry from './components/atom/LogEntry/';
import './App.css';
import { TIMESTAMP_FORMAT } from './lib/constants';

const STORAGE_KEY = 'tt_data';
const keyCodes = {
  enter: 13,
  rightBracket: 221, // ']'
  leftBracket: 219, // '['
}

const now = () => new Date();

const dateToString = date => moment(date).format(TIMESTAMP_FORMAT);

const appendStamp = val => (
  (/^$/g).test(val)
    ? `${val}${dateToString(now())} `
    : val
);

const setLog = (value, index, state) => {
  const newLogs = state.logs;
  const prevVal = newLogs[index];

  const newVal = (_.isEmpty(prevVal))
    ? `${dateToString(now())} ${value}`
    : value;
  newLogs[index] = appendStamp(newVal);
  return {
    logs: newLogs
  };
};

const hasStorage = () => {
  return window && !!window.localStorage;
}

class App extends Component {
  state = {
    logs: [''],
    autoSaveOn: true,
  };

  // ref tracker
  logInputs = [];

  autoSaveTimer = null;

  componentDidMount() {
    this.handleLoadClick();
  }

  handleLogsChange = (index, e) => {
    this.setState(
      setLog.bind(this, e.target.value, index),
      () => {
        if (this.autoSaveTimer) {
          window.clearTimeout(this.autoSaveTimer);
          this.autoSaveTimer = null;
        }

        this.autoSaveTimer = window.setTimeout(() => {
          if (this && typeof this.handleSaveClick === 'function') {
            this.handleSaveClick();
          }
        }, 1000)
      }
    );
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

      default: {
        // Do Nothing
        break;
      }
    }
  }

  handleSaveClick = () => {
    if (hasStorage()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.logs));
    }
  }

  handleLoadClick = () => {
    if (!hasStorage()) {
      return;
    }

    this.setState(state => {
      const storedData = window.localStorage.getItem(STORAGE_KEY);
      const d = storedData
        ? JSON.parse(storedData)
        : [''];
      return {
        logs: d.concat(this.state.logs)
      }
    })
  }

  handleClearClick = () => {
    this.setState({ logs: [''] });
  }

  render() {
    const logs = this.state.logs.join('\n');
    const parsedLogs = parser.parse(logs);
    const computed = parser.compute(parsedLogs);
    const tags = parser.computeTags(parsedLogs);
    return (
      <div className="App">
        <h1>Activity Logger</h1>
        <div className="Toolbar">
          <label>
            Auto-save?
            {' '}
            <input type="checkbox" onChange={this.handleAutoSaveChange} value={this.state.autoSaveOn} />
          </label>
          <button onClick={this.handleSaveClick}>Save</button>
          <button onClick={this.handleLoadClick}>Load</button>
          <button onClick={this.handleClearClick}>Clear</button>
        </div>
        {this.state.logs.map((log, i) => (
          <LogEntry
            key={`log_${i}`}
            onChange={this.handleLogsChange.bind(this, i)}
            onKeyDown={this.handleKeyDown.bind(this, i)}
            ref={c => this.logInputs[i] = c}
            value={log}
            duration={computed[i].duration}
          />
        ))}

        <TagSummary tags={tags} />
      </div>
    );
  }
}

export default App;
