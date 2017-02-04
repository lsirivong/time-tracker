import React from 'react';
import Duration from '../Duration/';
import DurationDecimal from '../DurationDecimal/';

const TagSummary = ({ tags = {} }) => { 
  const totalDuration = Object.keys(tags).reduce(
    (result, tagName) => result + tags[tagName].duration,
    0
  );

  return (
    <code>
      {Object.keys(tags).map(tagName =>
        <div key={tagName}>
          {tagName}:
          {' '}
          <Duration value={tags[tagName].duration} />
          {' '}
          (<DurationDecimal value={tags[tagName].duration} />)
        </div>
      )}
      <div key="total">
        <strong>Total</strong>:
        {' '}
        <Duration value={totalDuration} />
        {' '}
        (<DurationDecimal value={totalDuration} />)
      </div>
    </code>
  );
};

export default TagSummary;
