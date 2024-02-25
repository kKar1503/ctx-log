import { describe, it, expect } from "vitest";
import * as Append from "./append";

describe("append logic", () => {
  it("should append bytes correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: Uint8Array,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        new Uint8Array([4, 5, 6]),
        new Uint8Array([1, 2, 3, 4, 5, 6]),
        "\x01\x02\x03\x04\x05\x06",
      ],
      [
        new Uint8Array(0),
        new Uint8Array([4, 5, 6]),
        new Uint8Array([4, 5, 6]),
        "\x04\x05\x06",
      ],
      [
        new Uint8Array([1, 2, 3]),
        new Uint8Array(0),
        new Uint8Array([1, 2, 3]),
        "\x01\x02\x03",
      ],
      [new Uint8Array(0), new Uint8Array(0), new Uint8Array(0), ""],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendBytes(a, b)).toStrictEqual(result);
      expect(new TextDecoder().decode(Append.AppendBytes(a, b))).toStrictEqual(
        stringResult,
      );
    }
  });

  it("should append utf8 correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: string,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        "abc",
        new Uint8Array([1, 2, 3, 97, 98, 99]),
        "\x01\x02\x03abc",
      ],
      [new Uint8Array(0), "abc", new Uint8Array([97, 98, 99]), "abc"],
      [
        new Uint8Array([1, 2, 3]),
        "",
        new Uint8Array([1, 2, 3]),
        "\x01\x02\x03",
      ],
      [new Uint8Array(0), "", new Uint8Array(0), ""],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendUTF8(a, b)).toStrictEqual(result);
      expect(new TextDecoder().decode(Append.AppendUTF8(a, b))).toStrictEqual(
        stringResult,
      );
    }
  });

  it("should append utf8s correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: string[],
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        ["a", "b", "c"],
        new Uint8Array([1, 2, 3, 97, 98, 99]),
        "\x01\x02\x03abc",
      ],
      [new Uint8Array(0), ["a", "b", "c"], new Uint8Array([97, 98, 99]), "abc"],
      [
        new Uint8Array([1, 2, 3]),
        [],
        new Uint8Array([1, 2, 3]),
        "\x01\x02\x03",
      ],
      [new Uint8Array(0), [], new Uint8Array(0), ""],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendUTF8s(a, ...b)).toStrictEqual(result);
      expect(
        new TextDecoder().decode(Append.AppendUTF8s(a, ...b)),
      ).toStrictEqual(stringResult);
    }
  });

  it("should append null correctly", () => {
    const testCases: [
      a: Uint8Array,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        new Uint8Array([1, 2, 3, 110, 117, 108, 108]),
        "\x01\x02\x03null",
      ],
      [new Uint8Array(0), new Uint8Array([110, 117, 108, 108]), "null"],
    ];

    for (const [a, result, stringResult] of testCases) {
      expect(Append.AppendNull(a)).toStrictEqual(result);
      expect(new TextDecoder().decode(Append.AppendNull(a))).toStrictEqual(
        stringResult,
      );
    }
  });

  it("should append begin marker correctly", () => {
    const testCases: [
      a: Uint8Array,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        new Uint8Array([1, 2, 3, 123]),
        "\x01\x02\x03{",
      ],
      [new Uint8Array(0), new Uint8Array([123]), "{"],
    ];

    for (const [a, result, stringResult] of testCases) {
      expect(Append.AppendBeginMarker(a)).toStrictEqual(result);
      expect(
        new TextDecoder().decode(Append.AppendBeginMarker(a)),
      ).toStrictEqual(stringResult);
    }
  });

  it("should append end marker correctly", () => {
    const testCases: [
      a: Uint8Array,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        new Uint8Array([1, 2, 3, 125]),
        "\x01\x02\x03}",
      ],
      [new Uint8Array(0), new Uint8Array([125]), "}"],
    ];

    for (const [a, result, stringResult] of testCases) {
      expect(Append.AppendEndMarker(a)).toStrictEqual(result);
      expect(new TextDecoder().decode(Append.AppendEndMarker(a))).toStrictEqual(
        stringResult,
      );
    }
  });

  it("should append line break correctly", () => {
    const testCases: [
      a: Uint8Array,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        new Uint8Array([1, 2, 3, 10]),
        "\x01\x02\x03\n",
      ],
      [new Uint8Array(0), new Uint8Array([10]), "\n"],
    ];

    for (const [a, result, stringResult] of testCases) {
      expect(Append.AppendLineBreak(a)).toStrictEqual(result);
      expect(new TextDecoder().decode(Append.AppendLineBreak(a))).toStrictEqual(
        stringResult,
      );
    }
  });

  it("should append array start correctly", () => {
    const testCases: [
      a: Uint8Array,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        new Uint8Array([1, 2, 3, 91]),
        "\x01\x02\x03[",
      ],
      [new Uint8Array(0), new Uint8Array([91]), "["],
    ];

    for (const [a, result, stringResult] of testCases) {
      expect(Append.AppendArrayStart(a)).toStrictEqual(result);
      expect(
        new TextDecoder().decode(Append.AppendArrayStart(a)),
      ).toStrictEqual(stringResult);
    }
  });

  it("should append array end correctly", () => {
    const testCases: [
      a: Uint8Array,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        new Uint8Array([1, 2, 3, 93]),
        "\x01\x02\x03]",
      ],
      [new Uint8Array(0), new Uint8Array([93]), "]"],
    ];

    for (const [a, result, stringResult] of testCases) {
      expect(Append.AppendArrayEnd(a)).toStrictEqual(result);
      expect(new TextDecoder().decode(Append.AppendArrayEnd(a))).toStrictEqual(
        stringResult,
      );
    }
  });

  it("should append array delimiter correctly", () => {
    const testCases: [
      a: Uint8Array,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        new Uint8Array([1, 2, 3, 44]),
        "\x01\x02\x03,",
      ],
      [new Uint8Array(0), new Uint8Array(0), ""],
    ];

    for (const [a, result, stringResult] of testCases) {
      expect(Append.AppendArrayDelimiter(a)).toStrictEqual(result);
      expect(
        new TextDecoder().decode(Append.AppendArrayDelimiter(a)),
      ).toStrictEqual(stringResult);
    }
  });

  it("should append boolean correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: boolean,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        true,
        new Uint8Array([1, 2, 3, 116, 114, 117, 101]),
        "\x01\x02\x03true",
      ],
      [new Uint8Array(0), true, new Uint8Array([116, 114, 117, 101]), "true"],
      [
        new Uint8Array([1, 2, 3]),
        false,
        new Uint8Array([1, 2, 3, 102, 97, 108, 115, 101]),
        "\x01\x02\x03false",
      ],
      [
        new Uint8Array(0),
        false,
        new Uint8Array([102, 97, 108, 115, 101]),
        "false",
      ],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendBoolean(a, b)).toStrictEqual(result);
      expect(
        new TextDecoder().decode(Append.AppendBoolean(a, b)),
      ).toStrictEqual(stringResult);
    }
  });

  it("should append booleans correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: boolean[],
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        [true, false, true],
        new Uint8Array([
          1, 2, 3, 91, 116, 114, 117, 101, 44, 102, 97, 108, 115, 101, 44, 116,
          114, 117, 101, 93,
        ]),
        "\x01\x02\x03[true,false,true]",
      ],
      [
        new Uint8Array(0),
        [true, false, true],
        new Uint8Array([
          91, 116, 114, 117, 101, 44, 102, 97, 108, 115, 101, 44, 116, 114, 117,
          101, 93,
        ]),
        "[true,false,true]",
      ],
      [
        new Uint8Array([1, 2, 3]),
        [],
        new Uint8Array([1, 2, 3, 91, 93]),
        "\x01\x02\x03[]",
      ],
      [new Uint8Array(0), [], new Uint8Array([91, 93]), "[]"],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendBooleans(a, ...b)).toStrictEqual(result);
      expect(
        new TextDecoder().decode(Append.AppendBooleans(a, ...b)),
      ).toStrictEqual(stringResult);
    }
  });

  it("should append number correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: number,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        123,
        new Uint8Array([1, 2, 3, 49, 50, 51]),
        "\x01\x02\x03123",
      ],
      [
        new Uint8Array([1, 2, 3]),
        -123,
        new Uint8Array([1, 2, 3, 45, 49, 50, 51]),
        "\x01\x02\x03-123",
      ],
      [new Uint8Array(0), 123, new Uint8Array([49, 50, 51]), "123"],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendNumber(a, b)).toStrictEqual(result);
      expect(
        new TextDecoder().decode(Append.AppendNumber(a, b)).trim(),
      ).toStrictEqual(stringResult);
    }
  });

  it("should append numbers correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: number[],
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        [123, -123, 456],
        new Uint8Array([
          1, 2, 3, 91, 49, 50, 51, 44, 45, 49, 50, 51, 44, 52, 53, 54, 93,
        ]),
        "\x01\x02\x03[123,-123,456]",
      ],
      [
        new Uint8Array(0),
        [123, -123, 456],
        new Uint8Array([
          91, 49, 50, 51, 44, 45, 49, 50, 51, 44, 52, 53, 54, 93,
        ]),
        "[123,-123,456]",
      ],
      [
        new Uint8Array([1, 2, 3]),
        [],
        new Uint8Array([1, 2, 3, 91, 93]),
        "\x01\x02\x03[]",
      ],
      [new Uint8Array(0), [], new Uint8Array([91, 93]), "[]"],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendNumbers(a, ...b)).toStrictEqual(result);
      expect(
        new TextDecoder().decode(Append.AppendNumbers(a, ...b)),
      ).toStrictEqual(stringResult);
    }
  });

  it("should append string correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: string,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        "abc",
        new Uint8Array([1, 2, 3, 34, 97, 98, 99, 34]),
        '\x01\x02\x03"abc"',
      ],
      [new Uint8Array(0), "abc", new Uint8Array([34, 97, 98, 99, 34]), '"abc"'],
      [
        new Uint8Array([1, 2, 3]),
        "",
        new Uint8Array([1, 2, 3, 34, 34]),
        '\x01\x02\x03""',
      ],
      [new Uint8Array(0), "", new Uint8Array([34, 34]), '""'],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendString(a, b)).toStrictEqual(result);
      expect(new TextDecoder().decode(Append.AppendString(a, b))).toStrictEqual(
        stringResult,
      );
    }
  });

  it("should append strings correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: string[],
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        ["a", "b", "c"],
        new Uint8Array([
          1, 2, 3, 91, 34, 97, 34, 44, 34, 98, 34, 44, 34, 99, 34, 93,
        ]),
        '\x01\x02\x03["a","b","c"]',
      ],
      [
        new Uint8Array(0),
        ["a", "b", "c"],
        new Uint8Array([91, 34, 97, 34, 44, 34, 98, 34, 44, 34, 99, 34, 93]),
        '["a","b","c"]',
      ],
      [
        new Uint8Array([1, 2, 3]),
        [],
        new Uint8Array([1, 2, 3, 91, 93]),
        "\x01\x02\x03[]",
      ],
      [new Uint8Array(0), [], new Uint8Array([91, 93]), "[]"],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendStrings(a, ...b)).toStrictEqual(result);
      expect(
        new TextDecoder().decode(Append.AppendStrings(a, ...b)),
      ).toStrictEqual(stringResult);
    }
  });

  it("should append time correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: Date,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        new Date("2021-01-01T00:00:00Z"),
        new Uint8Array([
          1, 2, 3, 34, 50, 48, 50, 49, 45, 48, 49, 45, 48, 49, 84, 48, 48, 58,
          48, 48, 58, 48, 48, 46, 48, 48, 48, 90, 34,
        ]),
        '\x01\x02\x03"2021-01-01T00:00:00.000Z"',
      ],
      [
        new Uint8Array(0),
        new Date("2021-01-01T00:00:00Z"),
        new Uint8Array([
          34, 50, 48, 50, 49, 45, 48, 49, 45, 48, 49, 84, 48, 48, 58, 48, 48,
          58, 48, 48, 46, 48, 48, 48, 90, 34,
        ]),
        '"2021-01-01T00:00:00.000Z"',
      ],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendTime(a, b)).toStrictEqual(result);
      expect(new TextDecoder().decode(Append.AppendTime(a, b))).toStrictEqual(
        stringResult,
      );
    }
  });

  it("should append times correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: Date[],
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:00:00Z")],
        new Uint8Array([
          1, 2, 3, 91, 34, 50, 48, 50, 49, 45, 48, 49, 45, 48, 49, 84, 48, 48,
          58, 48, 48, 58, 48, 48, 46, 48, 48, 48, 90, 34, 44, 34, 50, 48, 50,
          49, 45, 48, 49, 45, 48, 49, 84, 48, 48, 58, 48, 48, 58, 48, 48, 46,
          48, 48, 48, 90, 34, 93,
        ]),
        '\x01\x02\x03["2021-01-01T00:00:00.000Z","2021-01-01T00:00:00.000Z"]',
      ],
      [
        new Uint8Array(0),
        [new Date("2021-01-01T00:00:00Z"), new Date("2021-01-01T00:00:00Z")],
        new Uint8Array([
          91, 34, 50, 48, 50, 49, 45, 48, 49, 45, 48, 49, 84, 48, 48, 58, 48,
          48, 58, 48, 48, 46, 48, 48, 48, 90, 34, 44, 34, 50, 48, 50, 49, 45,
          48, 49, 45, 48, 49, 84, 48, 48, 58, 48, 48, 58, 48, 48, 46, 48, 48,
          48, 90, 34, 93,
        ]),
        '["2021-01-01T00:00:00.000Z","2021-01-01T00:00:00.000Z"]',
      ],
      [
        new Uint8Array([1, 2, 3]),
        [],
        new Uint8Array([1, 2, 3, 91, 93]),
        "\x01\x02\x03[]",
      ],
      [new Uint8Array(0), [], new Uint8Array([91, 93]), "[]"],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendTimes(a, ...b)).toStrictEqual(result);
      expect(
        new TextDecoder().decode(Append.AppendTimes(a, ...b)),
      ).toStrictEqual(stringResult);
    }
  });

  it("should append duration correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: number,
      unit: Append.TDuration,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        123,
        "ms",
        new Uint8Array([1, 2, 3, 34, 49, 50, 51, 109, 115, 34]),
        '\x01\x02\x03"123ms"',
      ],
      [
        new Uint8Array(0),
        123,
        "ms",
        new Uint8Array([34, 49, 50, 51, 109, 115, 34]),
        '"123ms"',
      ],
      [
        new Uint8Array(0),
        123,
        "h",
        new Uint8Array([34, 49, 50, 51, 104, 34]),
        '"123h"',
      ],
      [
        new Uint8Array(0),
        123,
        "m",
        new Uint8Array([34, 50, 104, 58, 51, 109, 34]),
        '"2h:3m"',
      ],
      [
        new Uint8Array(0),
        12345,
        "s",
        new Uint8Array([34, 51, 104, 58, 50, 53, 109, 58, 52, 53, 115, 34]),
        '"3h:25m:45s"',
      ],
      [
        new Uint8Array(0),
        123456789,
        "ms",
        new Uint8Array([
          34, 51, 52, 104, 58, 49, 55, 109, 58, 51, 54, 115, 58, 55, 56, 57,
          109, 115, 34,
        ]),
        '"34h:17m:36s:789ms"',
      ],
      [
        new Uint8Array(0),
        12345.125,
        "ms",
        new Uint8Array([
          34, 49, 50, 115, 58, 51, 52, 53, 46, 49, 50, 53, 109, 115, 34,
        ]),
        '"12s:345.125ms"',
      ],
    ];

    for (const [a, b, unit, result, stringResult] of testCases) {
      expect(Append.AppendDuration(a, unit, b)).toStrictEqual(result);
      expect(
        new TextDecoder().decode(Append.AppendDuration(a, unit, b)),
      ).toStrictEqual(stringResult);
    }
  });

  it("should append durations correctly", () => {
    const testCases: [
      a: Uint8Array,
      unit: Append.TDuration,
      b: number[],
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        "ms",
        [123, 456, 789],
        new Uint8Array([
          1, 2, 3, 91, 34, 49, 50, 51, 109, 115, 34, 44, 34, 52, 53, 54, 109,
          115, 34, 44, 34, 55, 56, 57, 109, 115, 34, 93,
        ]),
        '\x01\x02\x03["123ms","456ms","789ms"]',
      ],
      [
        new Uint8Array(0),
        "ms",
        [123, 456, 789],
        new Uint8Array([
          91, 34, 49, 50, 51, 109, 115, 34, 44, 34, 52, 53, 54, 109, 115, 34,
          44, 34, 55, 56, 57, 109, 115, 34, 93,
        ]),
        '["123ms","456ms","789ms"]',
      ],
      [
        new Uint8Array([1, 2, 3]),
        "ms",
        [],
        new Uint8Array([1, 2, 3, 91, 93]),
        "\x01\x02\x03[]",
      ],
      [new Uint8Array(0), "ms", [], new Uint8Array([91, 93]), "[]"],
    ];

    for (const [a, unit, b, result, stringResult] of testCases) {
      expect(Append.AppendDurations(a, unit, ...b)).toStrictEqual(result);
      expect(
        new TextDecoder().decode(Append.AppendDurations(a, unit, ...b)),
      ).toStrictEqual(stringResult);
    }
  });

  it("should append any correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: any,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        { a: 1, b: "2", c: [3, 4, 5] },
        new Uint8Array([
          1, 2, 3, 123, 34, 97, 34, 58, 49, 44, 34, 98, 34, 58, 34, 50, 34, 44,
          34, 99, 34, 58, 91, 51, 44, 52, 44, 53, 93, 125,
        ]),
        '\x01\x02\x03{"a":1,"b":"2","c":[3,4,5]}',
      ],
      [
        new Uint8Array(0),
        { a: 1, b: "2", c: [3, 4, 5] },
        new Uint8Array([
          123, 34, 97, 34, 58, 49, 44, 34, 98, 34, 58, 34, 50, 34, 44, 34, 99,
          34, 58, 91, 51, 44, 52, 44, 53, 93, 125,
        ]),
        '{"a":1,"b":"2","c":[3,4,5]}',
      ],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendAny(a, b)).toStrictEqual(result);
      expect(new TextDecoder().decode(Append.AppendAny(a, b))).toStrictEqual(
        stringResult,
      );
    }
  });

  it("should append key correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: string,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        "abc",
        new Uint8Array([1, 2, 3, 44, 34, 97, 98, 99, 34, 58]),
        '\x01\x02\x03,"abc":',
      ],
      [
        new Uint8Array(0),
        "abc",
        new Uint8Array([34, 97, 98, 99, 34, 58]),
        '"abc":',
      ],
      [
        new Uint8Array([123]),
        "abc",
        new Uint8Array([123, 34, 97, 98, 99, 34, 58]),
        '{"abc":',
      ],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendKey(a, b)).toStrictEqual(result);
      expect(new TextDecoder().decode(Append.AppendKey(a, b))).toStrictEqual(
        stringResult,
      );
    }
  });

  it("should append object data correctly", () => {
    const testCases: [
      a: Uint8Array,
      b: Uint8Array,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        new Uint8Array([4, 5, 6]),
        new Uint8Array([1, 2, 3, 44, 4, 5, 6]),
        "\x01\x02\x03,\x04\x05\x06",
      ],
      [
        new Uint8Array([1, 2, 3, 44, 4, 5, 6]),
        new Uint8Array([7, 8, 9]),
        new Uint8Array([1, 2, 3, 44, 4, 5, 6, 44, 7, 8, 9]),
        "\x01\x02\x03,\x04\x05\x06,\x07\x08\x09",
      ],
      [
        new Uint8Array([123]),
        new Uint8Array([1, 2, 3]),
        new Uint8Array([123, 1, 2, 3]),
        "{\x01\x02\x03",
      ],
      [
        new Uint8Array([123, 1]),
        new Uint8Array([1, 2, 3]),
        new Uint8Array([123, 1, 44, 1, 2, 3]),
        "{\x01,\x01\x02\x03",
      ],
      [
        new Uint8Array([123, 1]),
        new Uint8Array([123, 1, 2, 3]),
        new Uint8Array([123, 1, 44, 1, 2, 3]),
        "{\x01,\x01\x02\x03",
      ],
    ];

    for (const [a, b, result, stringResult] of testCases) {
      expect(Append.AppendObjectData(a, b)).toStrictEqual(result);
      expect(
        new TextDecoder().decode(Append.AppendObjectData(a, b)),
      ).toStrictEqual(stringResult);
    }
  });

  it("should append space correctly", () => {
    const testCases: [
      a: Uint8Array,
      result: Uint8Array,
      stringResult: string,
    ][] = [
      [
        new Uint8Array([1, 2, 3]),
        new Uint8Array([1, 2, 3, 32]),
        "\x01\x02\x03 ",
      ],
      [new Uint8Array(0), new Uint8Array([32]), " "],
    ];

    for (const [a, result, stringResult] of testCases) {
      expect(Append.AppendSpace(a)).toStrictEqual(result);
      expect(new TextDecoder().decode(Append.AppendSpace(a))).toStrictEqual(
        stringResult,
      );
    }
  });
});
