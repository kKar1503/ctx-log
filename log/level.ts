export const LevelTraceValue = "trace";
export const LevelDebugValue = "debug";
export const LevelInfoValue = "info";
export const LevelWarnValue = "warn";
export const LevelErrorValue = "error";
export const LevelFatalValue = "fatal";

export const Level = {
  // TraceLevel defines trace log level.
  TraceLevel: LevelTraceValue,
  // DebugLevel defines debug log level.
  DebugLevel: LevelDebugValue,
  // InfoLevel defines info log level.
  InfoLevel: LevelInfoValue,
  // WarnLevel defines warn log level.
  WarnLevel: LevelWarnValue,
  // ErrorLevel defines error log level.
  ErrorLevel: LevelErrorValue,
  // FatalLevel defines fatal log level.
  FatalLevel: LevelFatalValue,
  // NoLevel defines an absent log level.
  NoLevel: "",
  // Disabled disables the logger.
  Disabled: "disabled",
} as const;

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
