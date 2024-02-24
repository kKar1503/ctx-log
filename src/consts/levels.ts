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
