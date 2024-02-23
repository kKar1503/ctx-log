import * as Append from "../json/append";
import { Logger } from "./logger";

import type { TDuration } from "../json/append";

export class Context {
  constructor(private logger: Logger) {}

  public Logger(): Logger {
    const l = new Logger(this.logger.w, this.logger.level);
    l.context = new Uint8Array([...this.logger.context]);
    l.hooks = [...this.logger.hooks];
    l.stack = this.logger.stack;

    return l;
  }

  public String(key: string, value: string): Context {
    this.logger.context = Append.AppendString(
      Append.AppendKey(this.logger.context, key),
      value,
    );
    return this;
  }

  public Strings(key: string, ...values: string[]): Context {
    this.logger.context = Append.AppendStrings(
      Append.AppendKey(this.logger.context, key),
      ...values,
    );
    return this;
  }

  public Number(key: string, value: number): Context {
    this.logger.context = Append.AppendNumber(
      Append.AppendKey(this.logger.context, key),
      value,
    );
    return this;
  }

  public Numbers(key: string, ...values: number[]): Context {
    this.logger.context = Append.AppendNumbers(
      Append.AppendKey(this.logger.context, key),
      ...values,
    );
    return this;
  }

  public Boolean(key: string, value: boolean): Context {
    this.logger.context = Append.AppendBoolean(
      Append.AppendKey(this.logger.context, key),
      value,
    );
    return this;
  }

  public Booleans(key: string, ...values: boolean[]): Context {
    this.logger.context = Append.AppendBooleans(
      Append.AppendKey(this.logger.context, key),
      ...values,
    );
    return this;
  }

  public Stack(): Context {
    this.logger.stack = true;
    return this;
  }

  public Error(err: Error): Context {
    this.logger.context = Append.AppendString(
      Append.AppendKey(this.logger.context, "error"),
      `${err.name}: ${err.message}`,
    );
    if (this.logger.stack && err.stack) {
      this.logger.context = Append.AppendString(
        Append.AppendKey(this.logger.context, "stack"),
        err.stack,
      );
    }
    return this;
  }

  public Time(key: string, value: Date): Context {
    this.logger.context = Append.AppendTime(
      Append.AppendKey(this.logger.context, key),
      value,
    );
    return this;
  }

  public Times(key: string, ...values: Date[]): Context {
    this.logger.context = Append.AppendTimes(
      Append.AppendKey(this.logger.context, key),
      ...values,
    );
    return this;
  }

  public Timestamp(): Context {
    this.logger.Hook({
      Run(e, _level, _message) {
        e.Timestamp();
      },
    });
    return this;
  }

  public Duration(key: string, unit: TDuration, value: number): Context {
    this.logger.context = Append.AppendDuration(
      Append.AppendKey(this.logger.context, key),
      unit,
      value,
    );
    return this;
  }

  public Durations(key: string, unit: TDuration, ...values: number[]): Context {
    this.logger.context = Append.AppendDurations(
      Append.AppendKey(this.logger.context, key),
      unit,
      ...values,
    );
    return this;
  }

  public Unknown(key: string, value: unknown): Context {
    this.logger.context = Append.AppendAny(
      Append.AppendKey(this.logger.context, key),
      value,
    );
    return this;
  }

  public Any(key: string, value: any): Context {
    this.logger.context = Append.AppendAny(
      Append.AppendKey(this.logger.context, key),
      value,
    );
    return this;
  }

  public Caller(): Context {
    this.logger.Hook({
      Run(e, _level, _message) {
        e.Caller();
      },
    });
    return this;
  }
}
