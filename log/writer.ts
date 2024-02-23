import type { TLevel } from "./level";

export interface IWriter {
  Write(p: Uint8Array): void;
}

export interface ILevelWriter extends IWriter {
  WriteLevel(level: TLevel, p: Uint8Array): void;
}

export class LevelWriterAdapter implements ILevelWriter {
  constructor(public Writer: IWriter) {}

  Write(p: Uint8Array) {
    return this.Writer.Write(p);
  }

  WriteLevel(_: TLevel, p: Uint8Array) {
    return this.Writer.Write(p);
  }
}

export class MultiLevelWriter implements ILevelWriter {
  constructor(public Writers: ILevelWriter[]) {}

  Write(p: Uint8Array) {
    for (const w of this.Writers) {
      w.Write(p);
    }
  }

  WriteLevel(level: TLevel, p: Uint8Array) {
    for (const w of this.Writers) {
      w.WriteLevel(level, p);
    }
  }
}

export function NewMultiLevelWriter(...writers: IWriter[]): ILevelWriter {
  const levelWriters = new Array<ILevelWriter>(writers.length);
  for (let i = 0; i < writers.length; i++) {
    if (WriterIsLevelWriter(writers[i])) {
      levelWriters[i] = writers[i] as ILevelWriter;
    } else {
      levelWriters[i] = new LevelWriterAdapter(writers[i]);
    }
  }
  return new MultiLevelWriter(levelWriters);
}

export function WriterIsLevelWriter(w: IWriter): w is ILevelWriter {
  return (
    (w as ILevelWriter).WriteLevel !== undefined &&
    typeof (w as ILevelWriter).WriteLevel === "function"
  );
}

export class FilteredLevelWriter implements ILevelWriter {
  constructor(
    public Writer: ILevelWriter,
    public Level: TLevel,
  ) {}

  Write(p: Uint8Array) {
    return this.Writer.Write(p);
  }

  WriteLevel(level: TLevel, p: Uint8Array) {
    if (level >= this.Level) {
      return this.Writer.WriteLevel(level, p);
    }
  }
}
