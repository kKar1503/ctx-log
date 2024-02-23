import type { IWriter, ILevelWriter } from "../log/writer";

export const StdoutWriter: IWriter = {
  Write: (p: Uint8Array) => {
    process.stdout.write(p);
  },
};

export const DiscardWriter: ILevelWriter = {
  Write: () => {},
  WriteLevel: (_level, _p) => {},
};
