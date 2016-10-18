import React from 'react';
import Duration from '../Duration/';

const TagSummary = ({ tags = {} }) => (
  <code>
    {Object.keys(tags).map(tagName =>
      <div key={tagName}>
        {tagName}: <Duration value={tags[tagName].duration} />
      </div>
    )}
  </code>
);

export default TagSummary;
