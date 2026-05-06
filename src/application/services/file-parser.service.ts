import { parse } from "csv-parse/sync";

export interface IFileParser {
  parseCsv<T>(buffer: Buffer): T[];
}

export class FileParserService implements IFileParser {
  parseCsv<T>(buffer: Buffer): T[] {
    return parse(buffer, {
      columns: true,
      cast: true,
      skip_empty_lines: true,
    });
  }
}
