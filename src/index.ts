import { Logger, NewLogger } from "./log/logger.js";
import { DiscardWriter, StdoutWriter } from "./writers/writers.js";
import { ConsoleWriter } from "./writers/console.js";
import { Level as LevelConsts } from "./consts/levels.js";
import {
  LevelWriterAdapter,
  MultiLevelWriter,
  NewMultiLevelWriter,
  WriterIsLevelWriter,
  FilteredLevelWriter,
} from "./log/writer.js";
import { LevelHook, NewLevelHook } from "./log/hook.js";

import type { Event } from "./log/event";
import type { IWriter, ILevelWriter } from "./log/writer";
import type { Context } from "./log/context";
import type { TLevel } from "./log/level";
import type { Hook, HookFunc } from "./log/hook";
import type { TDuration } from "./json/append";

export default Logger.GlobalLogger;

export {
  DiscardWriter,
  StdoutWriter,
  ConsoleWriter,
  LevelConsts as Level,
  NewLogger,
  LevelWriterAdapter,
  MultiLevelWriter,
  NewMultiLevelWriter,
  WriterIsLevelWriter,
  FilteredLevelWriter,
  LevelHook,
  NewLevelHook,
  Logger,
};

export type {
  Event,
  IWriter,
  ILevelWriter,
  Context,
  TLevel,
  Hook,
  HookFunc,
  TDuration,
};

export function SetGlobalLevel(level: TLevel): void {
  Logger.SetGlobalLevel(level);
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

export function WithLevel(level: TLevel): Logger {
  return Logger.GlobalLogger.Level(level);
}

export function Hooks(...hooks: Hook[]): Logger {
  return Logger.GlobalLogger.Hooks(...hooks);
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

export function Err(error?: Error): Event {
  return Logger.GlobalLogger.Error(error);
}

export function Fatal(): Event {
  return Logger.GlobalLogger.Fatal();
}

export function Log(): Event {
  return Logger.GlobalLogger.Log();
}
