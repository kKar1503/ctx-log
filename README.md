# Context Logger for TypeScript

A context logger written in TypeScript.

[![Version NPM](https://img.shields.io/npm/v/ctx-log.svg?style=flat-square)](https://www.npmjs.com/package/ctx-log)
[![GitHub License](https://img.shields.io/github/license/kKar1503/context-log)](./LICENSE)

[![NPM](https://nodei.co/npm/ctx-log.png?downloads=true&downloadRank=true)](https://nodei.co/npm/ctx-log/)

## Motivation

`ctx-log` is motivated by tagging loggers with a particular context to identify logs. 
It aims to be provide a fast and simple logger with JSON output with zero dependency. The idea of a context logger is that
each logger is attached with a particular context, in which can be used for better search and identification (see: [Contextual Logging](#context-logging)).

`ctx-log` logger can be easily configured to write to multiple `Writers` at multiple levels, which can be 
implemented by developers using provided interfaces (see: [Writers](#writers) & [Leveled Logging](#leveled-logging)).

`ctx-log` chaining API & design is inspired by GoLang logging library [zerolog](https://pkg.go.dev/github.com/rs/zerolog).

## Features

* [Leveled Logging](#leveled-logging)
* [Writers](#writers)
* [Hooks](#hooks)
* [Contextual fields](#context-logging)
* [Pretty Logging for Development](#pretty-logging)
* [Error Logging](#error-logging)
* [Caller](#caller)

## Installation

NPM: 
```bash
npm install ctx-log
```

Yarn:
```bash
yarn add ctx-log
```

PNPM:
```bash
pnpm add ctx-log
```

## Getting Started

### Simple Logging Example

The simplest way to get started with `ctx-log` is to use the default export global logger.

```ts
import log from "ctx-log";

log().Info().Msg("hello world");
// Output: {"level":"info","time":"2024-02-25T16:49:57.564Z","caller":"./src/index.ts:3","message":"Hello World!"}
```
> The default logger will initialize a `Writer` based on the environment variable `NODE_ENV`, if
> the `NODE_ENV` variable is set to `development`, it'll utilize the builtin `ConsoleWriter` for
> pretty logging. 

However, to use the logger more efficiently and in a customized fashion, it is recommend to create your own
logger and replace the existing global logger.

```ts
import log, { NewLogger, ConsoleWriter, Logger } from "ctx-log";

log().Info().Msg("Hello World!");
// Output: {"level":"info","time":"2024-02-25T17:12:58.199Z","caller":"./src/index.ts:3","message":"Hello World!"}

const newLogger = NewLogger(new ConsoleWriter());

Logger.GlobalLogger = newLogger;

log().Info().Msg("Hello World!");
// Output: INF Hello World!
```

<details>
  <summary>Why is the default export a function?</summary>
  
  Unfortunately, in order to have a global default export that can be changed, I could only
  use a function to get the `Logger.GlobalLogger` value everytime I'm accessing the logger.
</details>

### Leveled Logging

#### Log Levels

Logging levels in `ctx-log` is configured to have the following log levels (from the highest to lowest):

* fatal (Level.FatalLevel, 4)
* error (Level.ErrorLevel, 3)
* warn (Level.WarnLevel, 2)
* info (Level.InfoLevel, 1)
* debug (Level.DebugLevel, 0)
* trace (Level.TraceLevel, -1)

#### Simple Leveled Logging Example

```ts
log().Trace().Msg("Hello World!");
log().Debug().Msg("Hello World!");
log().Info().Msg("Hello World!");
log().Warn().Msg("Hello World!");
log().Error().Msg("Hello World!");
log().Fatal().Msg("Hello World!");

// Output:
// {"level":"trace","time":"2024-02-25T17:35:07.068Z","caller":"./src/index.ts:3","message":"Hello World!"}
// {"level":"debug","time":"2024-02-25T17:35:07.078Z","caller":"./src/index.ts:4","message":"Hello World!"}
// {"level":"info","time":"2024-02-25T17:35:07.078Z","caller":"./src/index.ts:5","message":"Hello World!"}
// {"level":"warn","time":"2024-02-25T17:35:07.078Z","caller":"./src/index.ts:6","message":"Hello World!"}
// {"level":"error","time":"2024-02-25T17:35:07.079Z","caller":"./src/index.ts:7","message":"Hello World!"}
// {"level":"fatal","time":"2024-02-25T17:35:07.079Z","caller":"./src/index.ts:8","message":"Hello World!"}
```
> Since `ctx-log` uses chaining methods, the chain must end with `Msg`, `MsgFunc` or `Send` method.
> If the log doesn't end with either of these 3 methods, the log will not be written.

#### Global Levels

You can set the global log level of the logger, which disables all level below the set level.

```ts
import log, { Level, SetGlobalLevel } from "ctx-log";

SetGlobalLevel(Level.WarnLevel);

log().Trace().msg("Hello World!");
log().Debug().Msg("Hello World!");
log().Info().Msg("Hello World!");
log().Warn().Msg("Hello World!");
log().Error().Msg("Hello World!");

// Output:
// {"level":"warn","time":"2024-02-25T17:45:32.297Z","caller":"./src/index.ts:8","message":"Hello World!"}
// {"level":"error","time":"2024-02-25T17:45:32.307Z","caller":"./src/index.ts:9","message":"Hello World!"}
```

### Logging without Level

You may send a log without using a `"level"` field, this can be done by using the `Log()` method.

```ts
log().Log().Msg("Hello World!");

// Output:
// {time":"2024-02-25T17:45:32.297Z","caller":"./src/index.ts:3","message":"Hello World!"}
```

### Logging without Message

You may send a log without using a `"message"` field, this can be done by ending the log with the `Send()` method or
using an empty string (`""`) in the `Msg()` method.

```ts
log().Info().Msg("");
log().Info().Send();

// Output:
// {"level":"warn","time":"2024-02-25T17:45:32.297Z","caller":"./src/index.ts:3"}
// {"level":"error","time":"2024-02-25T17:45:32.307Z","caller":"./src/index.ts:4"}
```

### Writers

WIP.

### Hooks

WIP.

### Contextual Fields

WIP.

### Pretty Logging for Development

WIP.

### Error Logging

You can log in `"error"` level using the `Error()` method as shown in [Leveled Logging](#leveled-logging). You can also
attach an error object to the error log.

```ts
log().Error(new Error("some error")).Msg("An error occurred");

// Output:
// {"level":"error","error":"Error: some error","time":"2024-02-25T18:12:58.746Z","caller":"./src/index.ts:3","message":"An error occurred"}
```
> The error is formatted as such: `${err.name}: ${err.message}`

#### Error Logging with Stacktrace

Using the `Stack()` method, the logger will use the builtin stacktrace in the `Error` object,
and format into an array for the stack.

```ts
function someFunction() {
  throw new Error("This is an error");
}

const loggerWithStack = log().With().Stack().Logger();

try {
  someFunction();
} catch (error) {
  loggerWithStack.Error(error as Error).Msg("An error occurred");
}

// Output (formatted):
// {
//   "level": "error",
//   "error": "Error: This is an error",
//   "stack": [
//     "Error: This is an error",
//     "at someFunction (./src/index.ts:4:9)",
//     "at Object.<anonymous> (./src/index.ts:10:3)",
//     "at Module._compile (node:internal/modules/cjs/loader:1376:14)",
//     ...
//   ],
//   "time": "2024-02-25T18:18:57.903Z",
//   "caller": "./src/index.ts:12",
//   "message": "An error occurred"
// }
```

#### Logging Fatal Level

When the `Fatal` level is used, the program will exit with `process.exit(1)`

```ts
log().Fatal().Error(new Error("some error")).Msg("Hello World!");

// Output:
// {"level":"fatal","error":"Error: some error","time":"2024-02-25T18:25:49.352Z","caller":"./src/index.ts:3","message":"Hello World!"}
```

### Caller

WIP.
