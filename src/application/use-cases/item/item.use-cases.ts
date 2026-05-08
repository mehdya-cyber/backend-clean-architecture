import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";
import { AppError } from "../../../core/error/app-error";
import { IItemRepository } from "../../../domain/interfaces/item-repository.interface";
import {
  TCreateItemCommand,
  TUpdateItemCommand,
  TItemsQueryCommand,
  TItemBulkUploadCommand,
  TProcessBulkUploadItemsCommand,
  TItemBulkUploadJobData,
} from "../../commands/item/item.command";
import { ItemEntity } from "../../../domain/entities/item/item.entity";
import { IAuditLogRepository } from "../../../domain/interfaces/audit-log-repository.interface";
import { ITransactionManager } from "../../ports/transaction-manager.port";
import { BulkUploadEntity } from "../../../domain/entities/bulk-upload/bulk-upload.entity";
import { IBulkUploadRepository } from "../../../domain/interfaces/bulk-upload-repository.interface";
import { IQueueService } from "../../ports/queue-service.port";
import { chunkArray } from "../../../core/utils/chunk-array";
import { IHashService } from "../../ports/hash-service.port";

export class ItemUseCases {
  constructor(
    private readonly itemRepository: IItemRepository,
    private readonly userRepository: IUserRepository,
    private readonly auditLogRepository: IAuditLogRepository,
    private readonly bulkUploadRepository: IBulkUploadRepository,

    private readonly transactionManager: ITransactionManager,
    private readonly bulkUploadQueue: IQueueService<TItemBulkUploadJobData>,
    private readonly hashService: IHashService,
  ) {}

  getItemsUseCase = async (query: TItemsQueryCommand) => {
    return this.itemRepository.findAll(query);
  };

  createItemUseCase = async (data: TCreateItemCommand) => {
    return this.transactionManager.runInTransaction(async (tx) => {
      const user = await this.userRepository.findById(data.userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const itemData = new ItemEntity({
        id: this.hashService.randomUUID(),
        name: data.name,
        description: data.description || null,
        tags: data.tags || [],
        price: data.price,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const item = await this.itemRepository.save(itemData);

      await this.auditLogRepository.create(
        {
          actorId: data.userId,
          action: "ITEM_CREATED",
          entity: "item",
          entityId: item.id,
          metadata: {
            itemId: item.id,
            name: item.name,
            price: item.price,
            tags: item.tags,
          },
        },
        tx,
      );

      return item;
    });
  };

  updateItemUseCase = async (data: TUpdateItemCommand) => {
    const item = await this.itemRepository.findById(data.id);

    const user = await this.userRepository.findById(data.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!item) {
      throw new AppError("Item not found", 404);
    }

    const itemData = new ItemEntity({
      ...item,
      ...data.patch,
      userId: data.userId,
    });

    await this.auditLogRepository.create({
      actorId: data.userId,
      action: "ITEM_UPDATED",
      entity: "item",
      entityId: item.id,
      metadata: {
        itemId: item.id,
        name: item.name,
        price: item.price,
        tags: item.tags,
      },
    });

    const updatedItem = await this.itemRepository.update(data.id, itemData);
    return updatedItem;
  };

  bulkUploadItemsUseCase = async (data: TItemBulkUploadCommand) => {
    const bulkupload = await this.transactionManager.runInTransaction(
      async (tx) => {
        const user = await this.userRepository.findById(data.userId);

        if (!user) {
          throw new AppError("User not found", 404);
        }

        const bulkUpload = new BulkUploadEntity({
          id: this.hashService.randomUUID(),
          fileName: data.fileName,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalRows: data.items.length,
          processedRows: 0,
          failedRows: 0,
          status: "PENDING",
          errorInfo: null,
        });

        const bulkUploadData = await this.bulkUploadRepository.save(
          bulkUpload,
          tx,
        );

        await this.auditLogRepository.create(
          {
            actorId: data.userId,
            action: "BULK_UPLOAD_CREATED",
            entity: "bulk_upload",
            entityId: bulkUploadData.id,
            metadata: {
              bulkUploadId: bulkUploadData.id,
              fileName: bulkUploadData.fileName,
              totalRows: bulkUploadData.totalRows,
            },
          },
          tx,
        );
        return bulkUploadData;
      },
    );

    const chunks = chunkArray(data.items, 1000) ?? [];
    for (let i = 0; i < chunks.length; i++) {
      await this.bulkUploadQueue.add(
        "items-bulk-upload-job",
        {
          bulkUploadId: bulkupload.id,
          userId: data.userId,
          items: chunks[i] ?? [],
        },
        { jobId: `${bulkupload.id}-${i}` },
      );
    }

    return {
      bulkUploadId: bulkupload.id,
      status: bulkupload.status,
      totalRows: bulkupload.totalRows,
    };
  };

  proccessItemsBulkUpload = async (command: TProcessBulkUploadItemsCommand) => {
    return this.transactionManager.runInTransaction(async (tx) => {
      const bulkUpload = await this.bulkUploadRepository.findById(
        command.bulkUploadId,
        tx,
      );

      if (!bulkUpload) {
        throw new AppError("Bulk upload not found", 404);
      }

      if (bulkUpload.status !== "PENDING") {
        return {
          bulkUploadId: bulkUpload.id,
          status: bulkUpload.status,
        };
      }

      bulkUpload.markProcessing();

      await this.bulkUploadRepository.update(bulkUpload.id, bulkUpload, tx);

      let processedItems = 0;
      let failedItems = 0;

      for (const item of command.data) {
        try {
          const now = new Date();

          const itemEntity = new ItemEntity({
            id: this.hashService.randomUUID(),
            name: item.name,
            price: item.price,
            userId: bulkUpload.userId,
            createdAt: now,
            updatedAt: now,
            description: null,
            tags: item.tags,
          });

          await this.itemRepository.save(itemEntity, tx);

          processedItems++;
        } catch {
          failedItems++;
        }
      }

      bulkUpload.markCompleted(processedItems, failedItems);

      const savedBulkUpload = await this.bulkUploadRepository.update(
        bulkUpload.id,
        bulkUpload,
        tx,
      );

      await this.auditLogRepository.create(
        {
          actorId: bulkUpload.userId,
          action: "ITEM_BULK_UPLOAD_COMPLETED",
          entity: "BULK_UPLOAD",
          entityId: bulkUpload.id,
          metadata: {
            totalItems: bulkUpload.totalRows,
            processedItems,
            failedItems,
          },
        },
        tx,
      );

      return {
        bulkUploadId: savedBulkUpload.id,
        status: savedBulkUpload.status,
        totalItems: savedBulkUpload.totalRows,
        processedItems: savedBulkUpload.processedRows,
        failedItems: savedBulkUpload.failedRows,
      };
    });
  };
}
