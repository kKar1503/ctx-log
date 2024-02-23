import * as Append from "../json/append";

import type { Logger } from "./logger";
import type { TDuration } from "../json/append";

export class Context {
  constructor(private logger: Logger) {}

  private CloneWithProperties(props: Partial<Context>): Context {
    const c = new Context(this.logger.Clone());
    c.logger.context = new Uint8Array([...this.logger.context]);
    c.logger.hooks = [...this.logger.hooks];
    c.logger.stack = this.logger.stack;
    Object.assign(c, props);
    return c;
  }

  public Logger(): Logger {
    return this.logger.Clone();
  }

  public String(key: string, value: string): Context {
    const c = this.CloneWithProperties({});
    c.logger.context = Append.AppendString(
      Append.AppendKey(c.logger.context, key),
      value,
    );
    return c;
  }

  public Strings(key: string, ...values: string[]): Context {
    const c = this.CloneWithProperties({});
    c.logger.context = Append.AppendStrings(
      Append.AppendKey(c.logger.context, key),
      ...values,
    );
    return c;
  }

  public Number(key: string, value: number): Context {
    const c = this.CloneWithProperties({});
    c.logger.context = Append.AppendNumber(
      Append.AppendKey(c.logger.context, key),
      value,
    );
    return c;
  }

  public Numbers(key: string, ...values: number[]): Context {
    const c = this.CloneWithProperties({});
    c.logger.context = Append.AppendNumbers(
      Append.AppendKey(c.logger.context, key),
      ...values,
    );
    return c;
  }

  public Boolean(key: string, value: boolean): Context {
    const c = this.CloneWithProperties({});
    c.logger.context = Append.AppendBoolean(
      Append.AppendKey(c.logger.context, key),
      value,
    );
    return c;
  }

  public Booleans(key: string, ...values: boolean[]): Context {
    const c = this.CloneWithProperties({});
    c.logger.context = Append.AppendBooleans(
      Append.AppendKey(c.logger.context, key),
      ...values,
    );
    return c;
  }

  public Stack(): Context {
    const c = this.CloneWithProperties({});
    c.logger.stack = true;
    return c;
  }

  public Error(err: Error): Context {
    const c = this.CloneWithProperties({});
    c.logger.context = Append.AppendString(
      Append.AppendKey(c.logger.context, "error"),
      `${err.name}: ${err.message}`,
    );
    if (c.logger.stack && err.stack) {
      c.logger.context = Append.AppendString(
        Append.AppendKey(c.logger.context, "stack"),
        err.stack,
      );
    }
    return c;
  }

  public Time(key: string, value: Date): Context {
    const c = this.CloneWithProperties({});
    c.logger.context = Append.AppendTime(
      Append.AppendKey(c.logger.context, key),
      value,
    );
    return c;
  }

  public Times(key: string, ...values: Date[]): Context {
    const c = this.CloneWithProperties({});
    c.logger.context = Append.AppendTimes(
      Append.AppendKey(c.logger.context, key),
      ...values,
    );
    return c;
  }

  public Timestamp(): Context {
    const c = this.CloneWithProperties({});
    c.logger.Hook({
      Run(e, _level, _message) {
        e.Timestamp();
      },
    });
    return c;
  }

  public Duration(key: string, unit: TDuration, value: number): Context {
    const c = this.CloneWithProperties({});
    c.logger.context = Append.AppendDuration(
      Append.AppendKey(c.logger.context, key),
      unit,
      value,
    );
    return c;
  }

  public Durations(key: string, unit: TDuration, ...values: number[]): Context {
    const c = this.CloneWithProperties({});
    c.logger.context = Append.AppendDurations(
      Append.AppendKey(c.logger.context, key),
      unit,
      ...values,
    );
    return c;
  }

  public Unknown(key: string, value: unknown): Context {
    const c = this.CloneWithProperties({});
    c.logger.context = Append.AppendAny(
      Append.AppendKey(c.logger.context, key),
      value,
    );
    return c;
  }

  public Any(key: string, value: any): Context {
    const c = this.CloneWithProperties({});
    c.logger.context = Append.AppendAny(
      Append.AppendKey(c.logger.context, key),
      value,
    );
    return c;
  }

  public Caller(): Context {
    const c = this.CloneWithProperties({});
    c.logger.Hook({
      Run(e, _level, _message) {
        e.Caller();
      },
    });
    return c;
  }
}
