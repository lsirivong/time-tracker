import parser from '../lib/parser';

describe('.parseLine', () => {
  it('passes smoke', () => {
    expect(
      parser.parseLine('2016-10-16T23:59:00.000Z TEXT')
    ).toBeTruthy();
  });

  it('gets the note', () => {
    expect(
      parser.parseLine('2016-10-16T23:59:00.000Z TEXT')
        .note
    ).toEqual('TEXT');
  });

  it('gets the timestamp', () => {
    expect(
      parser.parseLine('2016-10-16T23:59:00.000Z TEXT')
        .timestamp
    ).toEqual(new Date('2016-10-16T23:59:00.000Z'));
  });

  it('gets the depth', () => {
    expect(
      parser.parseLine('2016-10-16T23:59:00.000Z TEXT')
        .depth
    ).toEqual(0);

    expect(
      parser.parseLine('-2016-10-16T23:59:00.000Z TEXT')
        .depth
    ).toEqual(1);

    expect(
      parser.parseLine('--2016-10-16T23:59:00.000Z TEXT')
        .depth
    ).toEqual(2);
  });
});

describe('.timeDiff', () => {
  it('returns the difference of timestamps in milliseconds', () => {
    expect(
      parser.timeDiff(
        new Date('2016-10-16T23:59:50.000Z'),
        new Date('2016-10-16T23:59:00.000Z'),
      )
    ).toEqual(50000);
  });
});

describe('.parse', () => {
  it('handles malformed text', () => {
    expect(parser.parse('text')).toEqual([null]);
  });

  it('parses all lines', () => {
    const result = parser.parse([
      '2016-10-16T23:59:00.000Z Note',
      '2016-10-16T23:59:50.000Z Something Else',
    ].join('\n'));
    expect(
      result.length
    ).toEqual(2); // 50 seconds

    expect(
      result[0].note
    ).toEqual('Note');
  });
});

describe('.compute', () => {
  it('computes durations of logs', () => {
    const result = parser.compute([
      { note: 'Foo', timestamp: new Date('2016-10-16T23:59:00.000Z'), depth: 0 },
      { note: 'Bar', timestamp: new Date('2016-10-16T23:59:50.000Z'), depth: 0 },
    ]);
    expect(result.length).toEqual(2);
    expect(result[0].duration).toEqual(50000);
    expect(result[1].duration).toEqual(0);
  });

  it('computes duration if parent depth ends', () => {
    const result = parser.compute([
      { note: 'Foo', timestamp: new Date('2016-10-16T23:01:00.000Z'), depth: 0 },
      { note: 'Bar', timestamp: new Date('2016-10-16T23:02:00.000Z'), depth: 1 },
      { note: 'Bar', timestamp: new Date('2016-10-16T23:03:00.000Z'), depth: 0 },
    ]);
    expect(result.length).toEqual(3);
    expect(result[0].duration).toEqual(2 * 60 * 1000);
    expect(result[1].duration).toEqual(60 * 1000);
    expect(result[2].duration).toEqual(0);
  });
});
