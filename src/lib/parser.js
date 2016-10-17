
const parseLine = line => {
  const lineRegex = /^(-*)([^ ]+)[ ]+(.*)$/g;
  const matches = lineRegex.exec(line);
  return matches && matches.length === 4
    ? {
      note: matches[3],
      timestamp: new Date(matches[2]),
      depth: matches[1].length
    }
    : null;
}

const timeDiff = (a, b) => {
  return Number(a) - Number(b);
}

const parse = text => {
  const lines = text.split('\n');
  return lines.reduce(
      (result, line) => {
        return result.concat(parseLine(line))
      },
      []
    ).filter(l => l);
}

const compute = logs => {
  return logs.reduce(
    (acc, log, i, source) => {
      const nextLogAtSameDepth = source.slice(i + 1).find(l => l.depth <= log.depth);
      const duration = nextLogAtSameDepth ? timeDiff(nextLogAtSameDepth.timestamp, log.timestamp) : 0;
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

const parseAndCompute = text => {
  return compute(parse(text));
}

const parser = {
  compute,
  parse,
  parseAndCompute,
  parseLine,
  timeDiff,
};

export default parser;
