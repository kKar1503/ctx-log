import {
  CallerFieldName,
  ErrorFieldName,
  LevelFieldName,
  MessageFieldName,
  TimestampFieldName,
} from "../consts/fields";
import * as Append from "../json/append";
import { formattedLevels, levelColors } from "../consts/levels.js";

import type { IWriter } from "../log/writer";
import {
  colorBold,
  colorCyan,
  colorDarkGrey,
  colorRed,
  colorReset,
} from "../consts/colors";

export class ConsoleWriter implements IWriter {
  public NoColor: boolean = false;
  public Output: IWriter = {
    Write: (p: Uint8Array) => {
      process.stdout.write(p);
    },
  };
  public PartsOrdering: string[] = [
    TimestampFieldName,
    LevelFieldName,
    CallerFieldName,
    MessageFieldName,
    ErrorFieldName,
  ];
  // Formatters
  public TimestampFormatter: (d: Date) => Uint8Array = formatDate(this.NoColor);
  public LevelFormatter: (level: string) => Uint8Array = formatLevel(
    this.NoColor,
  );
  public CallerFormatter: (caller: string) => Uint8Array = formatCaller(
    this.NoColor,
  );
  public MessageFormatter: (msg: string) => Uint8Array = formatMessage(
    this.NoColor,
  );
  public ErrorFormatter: (error: Error) => Uint8Array = formatError(
    this.NoColor,
  );
  public KeyFormatter: (key: string) => Uint8Array = defaultKeyFomatter(
    this.NoColor,
  );
  public ValueFormatter: (value: any) => Uint8Array = defaultValueFormatter(
    this.NoColor,
  );

  constructor() {}

  public Write(p: Uint8Array) {
    const jsonStr = new TextDecoder().decode(p);
    const json = JSON.parse(jsonStr);
    const existingOrderedFields = this.PartsOrdering.filter((k) => k in json);
    const otherFieldsName = Object.keys(json).filter(
      (k) => !this.PartsOrdering.includes(k),
    );
    let output: Uint8Array = new Uint8Array(0);

    for (let i = 0; i < existingOrderedFields.length; i++) {
      const field = existingOrderedFields[i];
      const value = json[field];
      output = this.WriteParts(output, value, field);
      if (i !== existingOrderedFields.length - 1) {
        output = Append.AppendSpace(output);
      }
    }

    for (let i = 0; i < otherFieldsName.length; i++) {
      const field = otherFieldsName[i];
      const value = json[field];
      output = this.WriteParts(output, value, field);
      if (i !== otherFieldsName.length - 1) {
        output = Append.AppendSpace(output);
      }
    }

    output = Append.AppendLineBreak(output);

    process.stdout.write(output);
  }

  private WriteParts(buf: Uint8Array, value: any, field: string) {
    switch (field) {
      case TimestampFieldName:
        return Append.AppendBytes(buf, this.TimestampFormatter(value));
      case LevelFieldName:
        return Append.AppendBytes(buf, this.LevelFormatter(value));
      case CallerFieldName:
        return Append.AppendBytes(buf, this.CallerFormatter(value));
      case MessageFieldName:
        return Append.AppendBytes(buf, this.MessageFormatter(value));
      case ErrorFieldName:
        return Append.AppendBytes(buf, this.ErrorFormatter(value));
      default:
        return Append.AppendBytes(
          buf,
          Append.AppendBytes(
            this.KeyFormatter(field),
            this.ValueFormatter(value),
          ),
        );
    }
  }
}

function colorize(
  data: Uint8Array,
  color: string,
  noColor: boolean,
): Uint8Array {
  const noColorEnv = process.env["NO_COLOR"];
  if (noColor || noColorEnv === undefined || color === "0") {
    return data;
  }

  const colorCode = new TextEncoder().encode(color);
  const colorStart = new Uint8Array([27, 91, ...colorCode, 109]);
  const colorReset = new Uint8Array([27, 91, 48, 109]);
  const buf = new Uint8Array(
    colorStart.length + data.length + colorReset.length,
  );
  buf.set(colorStart, 0);
  buf.set(data, colorStart.length);
  buf.set(colorReset, colorStart.length + data.length);

  return buf;
}

function formatDate(noColor: boolean): (d: Date) => Uint8Array {
  return (d: Date) => {
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    const ms = d.getMilliseconds();
    let str = h.toString().padStart(2, "0") + ":";
    str += m.toString().padStart(2, "0") + ":";
    str += s.toString().padStart(2, "0") + ".";
    str += ms.toString().padStart(3, "0");
    return colorize(new TextEncoder().encode(str), colorDarkGrey, noColor);
  };
}

function formatLevel(noColor: boolean): (level: string) => Uint8Array {
  return (level: string) => {
    let formatted: string;
    let color: string;
    if (level in formattedLevels) {
      formatted = formattedLevels[level as keyof typeof formattedLevels];
      color = levelColors[level as keyof typeof formattedLevels];
    } else {
      formatted = level.substr(0, 3).toUpperCase();
      color = colorReset;
    }
    return colorize(new TextEncoder().encode(formatted), color, noColor);
  };
}

function formatCaller(noColor: boolean): (caller: string) => Uint8Array {
  return (caller: string) => {
    let wd = process.cwd();
    const wdEnv = process.env["PWD"];
    if (wdEnv !== undefined) {
      if (wdEnv !== wd) {
        wd = wdEnv;
      }
    }

    if (caller.startsWith(wd)) {
      caller = "." + caller.substr(wd.length);
    }

    const callerBuf = colorize(
      new TextEncoder().encode(caller),
      colorBold,
      noColor,
    );
    const arrowBuf = new Uint8Array([
      32, 27, 91, 51, 54, 109, 62, 27, 91, 48, 109,
    ]);

    return Append.AppendBytes(callerBuf, arrowBuf);
  };
}

function formatMessage(noColor: boolean): (msg: string) => Uint8Array {
  return (msg: string) => {
    return colorize(new TextEncoder().encode(msg), colorReset, noColor);
  };
}

function formatError(noColor: boolean): (error: Error) => Uint8Array {
  return (err: Error) => {
    const errFieldBuf = defaultKeyFomatter(noColor)(ErrorFieldName);

    const str = `${err.name}: ${err.message}`;
    const errValBuf = colorize(
      colorize(new TextEncoder().encode(str), colorBold, noColor),
      colorRed,
      noColor,
    );

    return Append.AppendBytes(errFieldBuf, errValBuf);
  };
}

function defaultKeyFomatter(noColor: boolean): (key: string) => Uint8Array {
  return (k: string) => {
    return colorize(new TextEncoder().encode(k + "="), colorCyan, noColor);
  };
}

function defaultValueFormatter(noColor: boolean): (value: any) => Uint8Array {
  return (v: any) => {
    const str = v.toString !== undefined ? v.toString() : JSON.stringify(v);
    return colorize(new TextEncoder().encode(str), colorReset, noColor);
  };
}
