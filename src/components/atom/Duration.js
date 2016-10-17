import React from 'react';

const Duration = ({ value }) => (
  <span>
    {/* TODO: replace with a date format library */}
    {`${Math.floor(value / (60 * 60 * 1000))}:${Math.floor(value / (60 * 1000) % 60)}`}
  </span>
)

export default Duration;
