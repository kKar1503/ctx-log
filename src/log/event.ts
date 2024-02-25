import * as Append from "../json/append.js";
import { Level } from "../consts/levels.js";
import * as Consts from "../consts/fields.js";

import type { TLevel } from "./level";
import type { ILevelWriter } from "./writer";
import type { Hook } from "./hook";
import type { TDuration } from "../json/append";

export class Event {
  public w: ILevelWriter = {} as ILevelWriter;
  public level: TLevel = Level.TraceLevel;
  public buf: Uint8Array = new Uint8Array(0);
  public ch: Hook[] = [];
  public stack: boolean = false;
  public done?: (msg: string) => void;

  constructor() {}

  public Write() {
    if (this.level !== Level.Disabled) {
      this.buf = Append.AppendEndMarker(this.buf);
      this.buf = Append.AppendLineBreak(this.buf);
      if (this.w) {
        this.w.WriteLevel(this.level, this.buf);
      }
    }

    eventPool.returnEvent(this);
    return;
  }

  public Enabled(): boolean {
    return this.level !== Level.Disabled;
  }

  public Discard(): Event {
    this.level = Level.Disabled;
    return this;
  }

  public Msg(msg: string) {
    return this.msg(msg);
  }

  public Send() {
    return this.msg("");
  }

  public MsgFunc(msg: () => string) {
    return this.msg(msg());
  }

  public msg(msg: string) {
    for (let i = 0; i < this.ch.length; i++) {
      this.ch[i].Run(this, this.level, msg);
    }
    if (msg !== "") {
      this.buf = Append.AppendString(
        Append.AppendKey(this.buf, Consts.MessageFieldName),
        msg,
      );
    }
    this.Write();
    if (this.done) {
      this.done(msg);
    }
  }

  public String(key: string, value: string) {
    this.buf = Append.AppendString(Append.AppendKey(this.buf, key), value);
    return this;
  }

  public Strings(key: string, ...value: string[]) {
    this.buf = Append.AppendStrings(Append.AppendKey(this.buf, key), ...value);
    return this;
  }

  public Number(key: string, value: number) {
    this.buf = Append.AppendNumber(Append.AppendKey(this.buf, key), value);
    return this;
  }

  public Numbers(key: string, ...value: number[]) {
    this.buf = Append.AppendNumbers(Append.AppendKey(this.buf, key), ...value);
    return this;
  }

  public Boolean(key: string, value: boolean) {
    this.buf = Append.AppendBoolean(Append.AppendKey(this.buf, key), value);
    return this;
  }

  public Booleans(key: string, ...value: boolean[]) {
    this.buf = Append.AppendBooleans(Append.AppendKey(this.buf, key), ...value);
    return this;
  }

  public Stack() {
    this.stack = true;
    return this;
  }

  public Error(err: Error) {
    this.buf = Append.AppendString(
      Append.AppendKey(this.buf, Consts.ErrorFieldName),
      `${err.name}: ${err.message}`,
    );
    if (this.stack && err.stack) {
      this.buf = Append.AppendStrings(
        Append.AppendKey(this.buf, Consts.StackFieldName),
        ...err.stack.split("\n").map((s) => s.trim()),
      );
    }
    return this;
  }

  public Time(key: string, value: Date) {
    this.buf = Append.AppendTime(Append.AppendKey(this.buf, key), value);
    return this;
  }

  public Times(key: string, ...value: Date[]) {
    this.buf = Append.AppendTimes(Append.AppendKey(this.buf, key), ...value);
    return this;
  }

  public Timestamp() {
    this.buf = Append.AppendString(
      Append.AppendKey(this.buf, Consts.TimestampFieldName),
      new Date().toISOString(),
    );
    return this;
  }

  public Duration(key: string, unit: TDuration, value: number) {
    this.buf = Append.AppendDuration(
      Append.AppendKey(this.buf, key),
      unit,
      value,
    );
    return this;
  }

  public Durations(key: string, unit: TDuration, ...value: number[]) {
    this.buf = Append.AppendDurations(
      Append.AppendKey(this.buf, key),
      unit,
      ...value,
    );
    return this;
  }

  public Unknown(key: string, value: unknown) {
    this.buf = Append.AppendAny(Append.AppendKey(this.buf, key), value);
    return this;
  }

  public Any(key: string, value: any) {
    this.buf = Append.AppendAny(Append.AppendKey(this.buf, key), value);
    return this;
  }

  public Properties(record: Record<string, any>) {
    Object.entries(record).forEach(([k, v]) => {
      switch (typeof v) {
        case "string":
          this.buf = Append.AppendString(Append.AppendKey(this.buf, k), v);
          break;
        case "number":
          this.buf = Append.AppendNumber(Append.AppendKey(this.buf, k), v);
          break;
        case "boolean":
          this.buf = Append.AppendBoolean(Append.AppendKey(this.buf, k), v);
          break;
        case "object":
          if (v instanceof Date) {
            this.buf = Append.AppendTime(Append.AppendKey(this.buf, k), v);
          } else if (v instanceof Error) {
            this.buf = Append.AppendString(
              Append.AppendKey(this.buf, k),
              `${v.name}: ${v.message}`,
            );
            if (this.stack && v.stack) {
              this.buf = Append.AppendString(
                Append.AppendKey(this.buf, "stack"),
                v.stack,
              );
            }
          } else if (v instanceof Uint8Array) {
            this.buf = Append.AppendBytes(Append.AppendKey(this.buf, k), v);
          } else {
            this.buf = Append.AppendAny(Append.AppendKey(this.buf, k), v);
          }
          break;
        default:
          this.buf = Append.AppendAny(Append.AppendKey(this.buf, k), v);
          break;
      }
    });
    return this;
  }

  public Caller() {
    const caller = getCaller();
    if (caller) {
      this.buf = Append.AppendString(
        Append.AppendKey(this.buf, Consts.CallerFieldName),
        `${caller.fileName}:${caller.lineNumber}`,
      );
    }
  }
}

function getCaller() {
  try {
    throw new Error();
  } catch (e) {
    const callerLine = (e as Error).stack?.split("\n")[6];
    if (callerLine) {
      const match = /at\s+(.*)\s+\((.*):(\d+):(\d+)\)/.exec(callerLine);
      if (match) {
        const [, , fileName, lineNumber] = match;
        return { fileName, lineNumber };
      }
    }
  }
  return null;
}

export function NewEvent(w: ILevelWriter, level: TLevel): Event {
  const e = eventPool.getEvent();
  e.buf = Append.AppendBeginMarker(new Uint8Array(0));
  e.w = w;
  e.level = level;
  return e;
}

class EventPool {
  private activeEvents: Event[];
  private reservedEvents: Event[];

  constructor(reservedEvents = 10) {
    this.activeEvents = [];
    this.reservedEvents = [];

    this.initializeReservedEvents(reservedEvents);
  }

  private initializeReservedEvents(reserve: number) {
    for (let i = 0; i < reserve; i++) {
      const event = new Event();
      this.reservedEvents.push(event);
    }
  }

  public getEvent(): Event {
    if (this.reservedEvents.length === 0) {
      this.reservedEvents.push(new Event());
    }

    const event = this.reservedEvents.pop()!;

    this.activeEvents.push(event);

    return event;
  }

  public returnEvent(event: Event) {
    const index = this.activeEvents.indexOf(event);
    if (index !== -1) {
      this.activeEvents.splice(index, 1);

      this.reservedEvents.push(event);
    }
  }
}

export const eventPool = new EventPool();
