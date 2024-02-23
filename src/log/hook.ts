import { Level } from "./level.js";

import type { Event } from "./event.ts";
import type { TLevel } from "./level.js";

export interface Hook {
  Run(e: Event, level: TLevel, message: string): void;
}

export type HookFunc = (e: Event, level: TLevel, message: string) => void;

export class LevelHook {
  public NoLevelHook?: Hook;
  public TraceHook?: Hook;
  public DebugHook?: Hook;
  public InfoHook?: Hook;
  public WarnHook?: Hook;
  public ErrorHook?: Hook;
  public FatalHook?: Hook;

  constructor() {}

  public Run(e: Event, level: TLevel, message: string) {
    switch (level) {
      case Level.TraceLevel:
        if (this.TraceHook) {
          this.TraceHook.Run(e, level, message);
        }
        break;
      case Level.DebugLevel:
        if (this.DebugHook) {
          this.DebugHook.Run(e, level, message);
        }
        break;
      case Level.InfoLevel:
        if (this.InfoHook) {
          this.InfoHook.Run(e, level, message);
        }
        break;
      case Level.WarnLevel:
        if (this.WarnHook) {
          this.WarnHook.Run(e, level, message);
        }
        break;
      case Level.ErrorLevel:
        if (this.ErrorHook) {
          this.ErrorHook.Run(e, level, message);
        }
        break;
      case Level.FatalLevel:
        if (this.FatalHook) {
          this.FatalHook.Run(e, level, message);
        }
        break;
      case Level.NoLevel:
        if (this.NoLevelHook) {
          this.NoLevelHook.Run(e, level, message);
        }
        break;
    }
  }
}

export function NewLevelHook(): LevelHook {
  return new LevelHook();
}
