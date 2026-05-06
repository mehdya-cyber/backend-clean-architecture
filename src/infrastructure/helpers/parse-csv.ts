import { parse } from "csv-parse/sync";

export const parseCsv = <T>(buffer: Buffer): T[] => {
  return parse(buffer, {
    columns: true,
    cast: true,
    skip_empty_lines: true,
  });
};
