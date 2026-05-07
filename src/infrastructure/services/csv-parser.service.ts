import { parse } from "csv-parse/sync";
import { ICsvFileParser } from "../../application/ports/file-parser.port";

export class CsvFileParser implements ICsvFileParser {
  parseCsv<T>(buffer: Buffer): T[] {
    return parse(buffer, {
      columns: true,
      cast: true,
      skip_empty_lines: true,
    });
  }
}
