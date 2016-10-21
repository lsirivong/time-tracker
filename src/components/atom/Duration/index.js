import React from 'react';
import moment from 'moment';
import 'moment-duration-format';
import './index.css';

const Duration = ({ value }) => (
  <span className="Log-duration">
    {moment.duration(value).format('h:mm', { trim: false })}
  </span>
)

export default Duration;
