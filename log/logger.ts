import * as Append from "../json/append";
import { GetLevelNumber, Level as LevelConsts } from "./level";
import { WriterIsLevelWriter, LevelWriterAdapter } from "./writer";
import { Context } from "./context";
import { NewEvent } from "./event";
import { LevelFieldName } from "../consts/fields";

import type { Event } from "./event";
import type { ILevelWriter, IWriter } from "./writer";
import type { Hook } from "./hook";
import type { TLevel } from "./level";

export const StdoutWriter: IWriter = {
  Write: (p: Uint8Array) => {
    process.stdout.write(p);
  },
};

export class Logger {
  private static globalLevel: TLevel = LevelConsts.TraceLevel;

  public static GlobalLogger: Logger = NewLogger(StdoutWriter)
    .With()
    .Timestamp()
    .Logger();

  public context: Uint8Array = new Uint8Array(0);
  public hooks: Hook[] = [];
  public stack: boolean = false;

  constructor(
    public w: ILevelWriter,
    public level: TLevel,
  ) {}

  public static SetGlobalLevel(level: TLevel) {
    Logger.globalLevel = level;
  }

  private CloneWithProperties(props: Partial<Logger>): Logger {
    const l = new Logger(this.w, this.level);
    l.context = new Uint8Array([...this.context]);
    l.hooks = [...this.hooks];
    l.stack = this.stack;

    Object.entries(props).forEach(([k, v]) => {
      (l as any)[k] = v;
    });

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

  public Hook(...hooks: Hook[]): Logger {
    const l = this.CloneWithProperties({});
    if (l.hooks.length === 0) {
      l.hooks = hooks;
      return l;
    }
    l.hooks.push(...hooks);
    return l;
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

const DiscardWriter: ILevelWriter = {
  Write: () => {},
  WriteLevel: (_level, _p) => {},
};

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

export function NopLogger(): Logger {
  return new Logger(DiscardWriter, LevelConsts.Disabled);
}

export function OutputLogger(w: IWriter): Logger {
  return Logger.GlobalLogger.Output(w);
}

export function With(): Context {
  return Logger.GlobalLogger.With();
}

export function Level(level: TLevel): Logger {
  return Logger.GlobalLogger.Level(level);
}

export function Hook(...hooks: Hook[]): Logger {
  return Logger.GlobalLogger.Hook(...hooks);
}

export function Trace(): Event {
  return Logger.GlobalLogger.Trace();
}

export function Debug(): Event {
  return Logger.GlobalLogger.Debug();
}

export function Info(): Event {
  return Logger.GlobalLogger.Info();
}

export function Warn(): Event {
  return Logger.GlobalLogger.Warn();
}

export function Error(error?: Error): Event {
  return Logger.GlobalLogger.Error(error);
}

export function Fatal(): Event {
  return Logger.GlobalLogger.Fatal();
}

export function Log(): Event {
  return Logger.GlobalLogger.Log();
}
