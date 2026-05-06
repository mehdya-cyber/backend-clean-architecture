import { TransactionContext } from "../../../../../core/types/transaction-context.types";
import { BulkUploadEntity } from "../../../../../domain/entities/bulk-upload/bulk-upload.entity";
import { IBulkUploadRepository } from "../../../../../domain/interfaces/bulk-upload-repository.interface";
import { BasePrismaRepository } from "../../base-prisma-repository";
import { BulkUpload } from "../../generated/prisma/client";

export class BulkUploadRepository
  extends BasePrismaRepository
  implements IBulkUploadRepository
{
  private toEntity(bulkUpload: BulkUpload): BulkUploadEntity {
    return new BulkUploadEntity({
      id: bulkUpload.id,
      userId: bulkUpload.userId,
      totalRows: bulkUpload.totalRows,
      processedRows: bulkUpload.processedRows,
      failedRows: bulkUpload.failedRows,
      fileName: bulkUpload.fileName,
      errorInfo: bulkUpload.errorInfo,
      status: bulkUpload.status,
      createdAt: bulkUpload.createdAt,
      updatedAt: bulkUpload.updatedAt,
    });
  }

  async findById(
    id: string,
    tx?: TransactionContext,
  ): Promise<BulkUploadEntity | null> {
    const prismaTx = this.getClient(tx);
    const bulkUpload = await prismaTx.bulkUpload.findUnique({
      where: { id },
    });
    return bulkUpload ? this.toEntity(bulkUpload) : null;
  }

  async save(
    data: BulkUploadEntity,
    tx?: TransactionContext,
  ): Promise<BulkUploadEntity> {
    const prismaTx = this.getClient(tx);
    const bulkUpload = await prismaTx.bulkUpload.create({
      data: {
        id: data.id,
        userId: data.userId,
        totalRows: data.totalRows,
        processedRows: data.processedRows,
        failedRows: data.failedRows,
        fileName: data.fileName,
        errorInfo: data.errorInfo,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
    return this.toEntity(bulkUpload);
  }

  async update(
    id: string,
    data: Partial<BulkUploadEntity>,
    tx?: TransactionContext,
  ): Promise<BulkUploadEntity> {
    const prismaTx = this.getClient(tx);
    const bulkUpload = await prismaTx.bulkUpload.update({
      where: { id },
      data: {
        totalRows: data.totalRows,
        processedRows: data.processedRows,
        failedRows: data.failedRows,
        errorInfo: data.errorInfo,
        status: data.status,
        updatedAt: data.updatedAt,
      },
    });
    return this.toEntity(bulkUpload);
  }
}
