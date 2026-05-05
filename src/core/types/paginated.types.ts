import { TPaginationMeta } from "./meta.types";

export type TPaginated<T> = {
  data: T[];
  meta: TPaginationMeta;
};
