import { TransactionContext } from "../../core/types/transaction-context.types";
import { BulkUploadEntity } from "../entities/bulk-upload/bulk-upload.entity";

export interface IBulkUploadRepository {
  save(
    data: BulkUploadEntity,
    tx?: TransactionContext,
  ): Promise<BulkUploadEntity>;
  findById(
    id: string,
    tx?: TransactionContext,
  ): Promise<BulkUploadEntity | null>;

  update(
    id: string,
    data: Partial<BulkUploadEntity>,
    tx?: TransactionContext,
  ): Promise<BulkUploadEntity>;
}
