import * as colors from "./colors.js";

const LevelTraceValue = "trace";
const LevelDebugValue = "debug";
const LevelInfoValue = "info";
const LevelWarnValue = "warn";
const LevelErrorValue = "error";
const LevelFatalValue = "fatal";

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

export const formattedLevels = {
  [LevelTraceValue]: "TRC",
  [LevelDebugValue]: "DBG",
  [LevelInfoValue]: "INF",
  [LevelWarnValue]: "WRN",
  [LevelErrorValue]: "ERR",
  [LevelFatalValue]: "FTL",
} as const;

export const levelColors = {
  [LevelTraceValue]: colors.colorBlue,
  [LevelDebugValue]: colors.colorReset,
  [LevelInfoValue]: colors.colorGreen,
  [LevelWarnValue]: colors.colorYellow,
  [LevelErrorValue]: colors.colorRed,
  [LevelFatalValue]: colors.colorMagenta,
} as const;
