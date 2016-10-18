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

  it('gets tags', () => {
    expect(
      parser.parseLine('2016-10-16T23:59:00.000Z TEXT [foo] [bar]')
        .tags
    ).toEqual(['foo', 'bar']);

    // No tags
    expect(
      parser.parseLine('2016-10-16T23:59:00.000Z No Tags')
        .tags
    ).toEqual([]);

    // one tag
    expect(
      parser.parseLine('2016-10-16T23:59:00.000Z [test] One Tag')
        .tags
    ).toEqual(['test']);

    // no closing tag
    expect(
      parser.parseLine('2016-10-16T23:59:00.000Z [test One Tag')
        .tags
    ).toEqual([]);
  })
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

describe('.computeTags', () => {
    it('computes aggregation of tags', () => {
      const result = parser.computeTags([
        { note: 'Test 1 [foo]', tags: ['foo'], timestamp: new Date('2016-10-16T23:59:00.000Z'), depth: 0 },
        { note: 'Test 2 [bar]', tags: ['bar'], timestamp: new Date('2016-10-16T23:59:50.000Z'), depth: 0 },
      ]);
      expect(result).toEqual({
        foo: {
          duration: 50000
        },
        bar: {
          duration: 0
        }
      });

      const result2 = parser.computeTags([
        { note: 'Test 1 [foo]', tags: ['foo'], timestamp: new Date('2016-10-16T23:00:00.000Z'), depth: 0 },
        { note: 'Test 2 [bar]', tags: ['bar'], timestamp: new Date('2016-10-16T23:00:50.000Z'), depth: 0 },
        { note: 'Test 3 [foo]', tags: ['foo'], timestamp: new Date('2016-10-16T23:01:00.000Z'), depth: 0 },
        { note: 'END', tags: [], timestamp: new Date('2016-10-16T23:01:50.000Z'), depth: 0 },
      ]);
      expect(result2).toEqual({
        foo: {
          duration: 100000
        },
        bar: {
          duration: 10000
        }
      });
    });
});
