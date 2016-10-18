import React from 'react';
import ReactDOM from 'react-dom';
import TagSummary from './';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TagSummary />, div);
});
