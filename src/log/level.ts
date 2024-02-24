import { Level } from "../consts/levels.js";

export type TLevel = (typeof Level)[keyof typeof Level];

export function ParseLevel(levelStr: string): TLevel {
  switch (levelStr.toLowerCase()) {
    case Level.TraceLevel:
      return Level.TraceLevel;
    case Level.DebugLevel:
      return Level.DebugLevel;
    case Level.InfoLevel:
      return Level.InfoLevel;
    case Level.WarnLevel:
      return Level.WarnLevel;
    case Level.ErrorLevel:
      return Level.ErrorLevel;
    case Level.FatalLevel:
      return Level.FatalLevel;
    case Level.Disabled:
      return Level.Disabled;
    default:
      return Level.NoLevel;
  }
}

export function GetLevelNumber(level: TLevel): number {
  switch (level) {
    case Level.TraceLevel:
      return -1;
    case Level.DebugLevel:
      return 0;
    case Level.InfoLevel:
      return 1;
    case Level.WarnLevel:
      return 2;
    case Level.ErrorLevel:
      return 3;
    case Level.FatalLevel:
      return 4;
    case Level.NoLevel:
      return 5;
    case Level.Disabled:
      return 6;
  }
}
