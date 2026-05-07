export interface ICsvFileParser {
  parseCsv<T>(buffer: Buffer): T[];
}
