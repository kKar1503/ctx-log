import * as Append from "../json/append.js";
import { GetLevelNumber, Level as LevelConsts } from "./level.js";
import { WriterIsLevelWriter, LevelWriterAdapter } from "./writer.js";
import { Context } from "./context.js";
import { NewEvent } from "./event.js";
import { LevelFieldName } from "../consts/fields.js";
import { StdoutWriter, DiscardWriter } from "../writers/writers.js";

import type { Event } from "./event";
import type { ILevelWriter, IWriter } from "./writer";
import type { Hook } from "./hook";
import type { TLevel } from "./level";

export class Logger {
  private static globalLevel: TLevel = LevelConsts.TraceLevel;

  public static GlobalLogger: Logger;

  public context: Uint8Array = new Uint8Array(0);
  public hooks: Hook[] = [];
  public stack: boolean = false;

  constructor(
    public w: ILevelWriter,
    public level: TLevel,
  ) {}

  public static Init(): void {
    Logger.GlobalLogger = NewLogger(StdoutWriter)
      .With()
      .Timestamp()
      .Caller()
      .Logger();
  }

  public static SetGlobalLevel(level: TLevel) {
    Logger.globalLevel = level;
  }

  private CloneWithProperties(props: Partial<Logger>): Logger {
    const l = new Logger(this.w, this.level);
    l.context = new Uint8Array([...this.context]);
    l.hooks = [...this.hooks];
    l.stack = this.stack;
    Object.assign(l, props);
    return l;
  }

  private Should(level: TLevel): boolean {
    if (!this.w) {
      return false;
    }

    const logLevel = GetLevelNumber(level);
    const loggerLevel = GetLevelNumber(this.level);
    const globalLevel = GetLevelNumber(Logger.globalLevel);

    if (logLevel < loggerLevel || logLevel < globalLevel) {
      return false;
    }

    return true;
  }

  private NewEvent(level: TLevel, done?: (msg: string) => void): Event {
    const enabled = this.Should(level);
    if (!enabled) {
      if (done) {
        done("");
      }

      return NewEvent(this.w, LevelConsts.Disabled);
    }

    const e = NewEvent(this.w, level);
    if (done) e.done = done;
    e.ch = this.hooks;
    if (level !== LevelConsts.NoLevel) {
      e.String(LevelFieldName, level);
    }
    if (this.context.length > 1) {
      e.buf = Append.AppendObjectData(e.buf, this.context);
    }
    if (this.stack) {
      e.Stack();
    }

    return e;
  }

  public Clone(): Logger {
    return this.CloneWithProperties({});
  }

  public Output(w: IWriter): Logger {
    const l2 = NewLogger(w);
    l2.level = this.level;
    l2.stack = this.stack;
    if (this.context.length > 0) {
      const newContext = new Uint8Array(this.context.length);
      newContext.set([...this.context]);
    }
    if (this.hooks.length > 0) {
      l2.hooks = this.hooks;
    }
    return l2;
  }

  public With(): Context {
    const l = this.CloneWithProperties({});
    if (l.context.length === 0) {
      l.context = Append.AppendBeginMarker(l.context);
    }

    return new Context(l);
  }

  public Level(level: TLevel): Logger {
    return this.CloneWithProperties({ level });
  }

  public GetLevel(): TLevel {
    return this.level;
  }

  public Hooks(...hooks: Hook[]): Logger {
    if (this.hooks.length === 0) {
      this.hooks = hooks;
      return this;
    }
    this.hooks.push(...hooks);
    return this;
  }

  public Trace(): Event {
    return this.NewEvent(LevelConsts.TraceLevel);
  }

  public Debug(): Event {
    return this.NewEvent(LevelConsts.DebugLevel);
  }

  public Info(): Event {
    return this.NewEvent(LevelConsts.InfoLevel);
  }

  public Warn(): Event {
    return this.NewEvent(LevelConsts.WarnLevel);
  }

  public Error(error?: Error): Event {
    const e = this.NewEvent(LevelConsts.ErrorLevel);
    if (error) {
      e.Error(error);
    }

    return e;
  }

  public Fatal(): Event {
    return this.NewEvent(LevelConsts.FatalLevel, (_msg) => {
      process.exit(1);
    });
  }

  public Log(): Event {
    return this.NewEvent(LevelConsts.NoLevel);
  }
}

export function NewLogger(w?: IWriter): Logger {
  let lw: ILevelWriter;
  if (w === undefined) {
    lw = DiscardWriter;
  } else {
    if (WriterIsLevelWriter(w)) {
      lw = w;
    } else {
      lw = new LevelWriterAdapter(w);
    }
  }

  return new Logger(lw, LevelConsts.TraceLevel);
}

Logger.Init();
