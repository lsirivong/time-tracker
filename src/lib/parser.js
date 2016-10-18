const parseTags = text => {
  const tagRegex = /\[([^\]]*)\]/g;
  let tags = [];
  let matches = tagRegex.exec(text);
  while (matches !== null) {
    tags.push(matches[1]);
    matches = tagRegex.exec(text)
  }

  return tags;
}

const parseLine = line => {
  // $0 - depth separator
  // $1 - timestamp
  // $2 - note
  const lineRegex = /^(-*)([^ ]+)[ ]+(.*)$/g;
  const matches = lineRegex.exec(line);
  return matches && matches.length === 4
    ? {
      note: matches[3],
      timestamp: new Date(matches[2]),
      depth: matches[1].length,
      tags: parseTags(matches[3])
    }
    : null;
}

const timeDiff = (a, b) => {
  return a - b;
}

const parse = text => {
  const lines = text.split('\n');
  return lines.reduce(
      (result, line) => {
        return result.concat(parseLine(line))
      },
      []
    );
}

const compute = logs => {
  return logs.reduce(
    (acc, log, i, source) => {
      const nextLogAtSameDepth = source
        .slice(i + 1)
        .find(l => l && log && l.depth <= log.depth);
      const duration = nextLogAtSameDepth
        ? timeDiff(nextLogAtSameDepth.timestamp, log.timestamp)
        : 0;
      return acc.concat(
        {
          ...log,
          duration,
        }
      )
    },
    []
  );
};

const computeTags = logs => {
  return compute(logs).reduce(
    (acc, log, i, source) => {
      (log.tags || []).forEach(tag => {
        const computedTag = acc[tag] || { duration: 0 };
        computedTag.duration += log.duration;

        return acc[tag] = computedTag;
      });
      return acc;
    },
    {}
  );
}

const parseAndCompute = text => {
  return compute(parse(text));
}

const parser = {
  compute,
  computeTags,
  parse,
  parseAndCompute,
  parseLine,
  timeDiff,
};

export default parser;
