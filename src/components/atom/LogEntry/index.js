import React from 'react';
import Duration from '../Duration/';
import './index.css';

class LogEntry extends React.Component {
  // DOM reference for the entry
  _input = null;

  focus() {
    if (this._input) {
      this._input.focus();
    }
  }

  render () {
    const {
      onChange,
      onKeyDown,
      value,
      duration
    } = this.props;

    return (
      <div className="Log-item">
        <input
          type="text"
          className="Log-input"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={value}
          ref={c => this._input = c}
        />
        {' '}
        <Duration value={duration} />
      </div>
    );
  };
};

export default LogEntry;
