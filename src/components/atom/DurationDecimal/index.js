import React from 'react';
import moment from 'moment';
import 'moment-duration-format';
import './index.css';

const DurationDecimal = ({ value }) => (
  <span className="Log-duration">
    {moment.duration(value).asHours().toFixed(2)}
  </span>
)

export default DurationDecimal;
