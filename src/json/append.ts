export type TDuration = "ms" | "s" | "m" | "h";

export function AppendBytes(buf: Uint8Array, bytes: Uint8Array): Uint8Array {
  const newBuf = new Uint8Array(buf.length + bytes.length);
  newBuf.set(buf);
  newBuf.set(bytes, buf.length);
  return newBuf;
}

export function AppendUTF8(buf: Uint8Array, ch: string): Uint8Array {
  return AppendBytes(buf, new TextEncoder().encode(ch));
}

export function AppendUTF8s(buf: Uint8Array, ...chs: string[]): Uint8Array {
  return AppendUTF8(buf, chs.join(""));
}

export function AppendNull(buf: Uint8Array): Uint8Array {
  return AppendUTF8(buf, "null");
}

export function AppendBeginMarker(buf: Uint8Array): Uint8Array {
  return AppendUTF8(buf, "{");
}

export function AppendEndMarker(buf: Uint8Array): Uint8Array {
  return AppendUTF8(buf, "}");
}

export function AppendLineBreak(buf: Uint8Array): Uint8Array {
  return AppendUTF8(buf, "\n");
}

export function AppendArrayStart(buf: Uint8Array): Uint8Array {
  return AppendUTF8(buf, "[");
}

export function AppendArrayEnd(buf: Uint8Array): Uint8Array {
  return AppendUTF8(buf, "]");
}

export function AppendSpace(buf: Uint8Array): Uint8Array {
  return AppendUTF8(buf, " ");
}

export function AppendArrayDelimiter(buf: Uint8Array): Uint8Array {
  if (buf.length === 0) {
    return buf;
  }

  return AppendUTF8(buf, ",");
}

export function AppendBoolean(buf: Uint8Array, val: boolean): Uint8Array {
  if (val) {
    return AppendUTF8(buf, "true");
  }
  return AppendUTF8(buf, "false");
}

export function AppendBooleans(
  buf: Uint8Array,
  ...vals: boolean[]
): Uint8Array {
  if (vals.length === 0) {
    return AppendUTF8(buf, "[]");
  }

  buf = AppendArrayStart(buf);
  buf = AppendBoolean(buf, vals[0]);
  if (vals.length > 1) {
    for (let i = 1; i < vals.length; i++) {
      buf = AppendArrayDelimiter(buf);
      buf = AppendBoolean(buf, vals[i]);
    }
  }
  buf = AppendArrayEnd(buf);
  return buf;
}

export function AppendNumber(buf: Uint8Array, val: number): Uint8Array {
  return AppendUTF8(buf, val.toString());
}

export function AppendNumbers(buf: Uint8Array, ...vals: number[]): Uint8Array {
  if (vals.length === 0) {
    return AppendUTF8s(buf, "[", "]");
  }

  buf = AppendArrayStart(buf);
  buf = AppendNumber(buf, vals[0]);
  if (vals.length > 1) {
    for (let i = 1; i < vals.length; i++) {
      buf = AppendArrayDelimiter(buf);
      buf = AppendNumber(buf, vals[i]);
    }
  }
  buf = AppendArrayEnd(buf);
  return buf;
}

export function AppendString(buf: Uint8Array, val: string): Uint8Array {
  return AppendUTF8(buf, '"' + val + '"');
}

export function AppendStrings(buf: Uint8Array, ...vals: string[]): Uint8Array {
  if (vals.length === 0) {
    return AppendUTF8s(buf, "[", "]");
  }

  buf = AppendArrayStart(buf);
  buf = AppendString(buf, vals[0]);
  if (vals.length > 1) {
    for (let i = 1; i < vals.length; i++) {
      buf = AppendArrayDelimiter(buf);
      buf = AppendString(buf, vals[i]);
    }
  }
  buf = AppendArrayEnd(buf);
  return buf;
}

export function AppendTime(buf: Uint8Array, val: Date): Uint8Array {
  return AppendString(buf, val.toISOString());
}

export function AppendTimes(buf: Uint8Array, ...vals: Date[]): Uint8Array {
  if (vals.length === 0) {
    return AppendUTF8s(buf, "[", "]");
  }

  buf = AppendArrayStart(buf);
  buf = AppendTime(buf, vals[0]);
  if (vals.length > 1) {
    for (let i = 1; i < vals.length; i++) {
      buf = AppendArrayDelimiter(buf);
      buf = AppendTime(buf, vals[i]);
    }
  }
  buf = AppendArrayEnd(buf);
  return buf;
}

export function AppendDuration(
  buf: Uint8Array,
  unit: TDuration = "ms",
  val: number,
): Uint8Array {
  switch (unit) {
    case "h":
      return AppendString(buf, `${val}${unit}`);
    case "m": {
      const h = Math.floor(val / 60);
      const m = val % 60;
      let str = "";
      if (h > 0) {
        str += `${h}h:`;
      }
      return AppendString(buf, `${str}${m}m`);
    }
    case "s": {
      const h = Math.floor(val / 3600);
      const m = Math.floor((val % 3600) / 60);
      const s = val % 60;
      let str = "";
      if (h > 0) {
        str += `${h}h:${m}m:`;
      } else if (m > 0) {
        str += `${m}m:`;
      }
      return AppendString(buf, `${str}${s}s`);
    }
    case "ms": {
      const h = Math.floor(val / 3600000);
      const m = Math.floor((val % 3600000) / 60000);
      const s = Math.floor((val % 60000) / 1000);
      const ms = val % 1000;
      let str = "";
      if (h > 0) {
        str += `${h}h:${m}m:${s}s:`;
      } else if (m > 0) {
        str += `${m}m:${s}s:`;
      } else if (s > 0) {
        str += `${s}s:`;
      }
      return AppendString(buf, `${str}${ms}ms`);
    }
  }
}

export function AppendDurations(
  buf: Uint8Array,
  unit: TDuration,
  ...vals: number[]
): Uint8Array {
  if (vals.length === 0) {
    return AppendUTF8s(buf, "[", "]");
  }

  buf = AppendArrayStart(buf);
  buf = AppendDuration(buf, unit, vals[0]);
  if (vals.length > 1) {
    for (let i = 1; i < vals.length; i++) {
      buf = AppendArrayDelimiter(buf);
      buf = AppendDuration(buf, unit, vals[i]);
    }
  }
  buf = AppendArrayEnd(buf);
  return buf;
}

export function AppendAny(buf: Uint8Array, val: any): Uint8Array {
  try {
    const objString = JSON.stringify(val);
    return AppendUTF8(buf, objString);
  } catch (e) {
    return AppendUTF8(buf, `JSON.stringify error: ${e}`);
  }
}

export function AppendKey(buf: Uint8Array, key: string): Uint8Array {
  if (buf.length > 0 && buf[buf.length - 1] !== "{".charCodeAt(0)) {
    buf = AppendUTF8(buf, ",");
  }
  return AppendUTF8(AppendString(buf, key), ":");
}

export function AppendObjectData(dst: Uint8Array, o: Uint8Array): Uint8Array {
  // Three conditions apply here:
  // 1. new content starts with '{' - which should be dropped   OR
  // 2. new content starts with '{' - which should be replaced with ','
  //    to separate with existing content OR
  // 3. existing content has already other fields
  if (o[0] === "{".charCodeAt(0)) {
    if (dst.length > 1) {
      dst = AppendUTF8(dst, ",");
    }
    o = o.subarray(1);
  } else if (dst.length > 1) {
    dst = AppendUTF8(dst, ",");
  }
  return AppendBytes(dst, o);
}
