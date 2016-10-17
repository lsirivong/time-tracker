import React from 'react';
import ReactDOM from 'react-dom';
import Duration from './Duration';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Duration />, div);
});
