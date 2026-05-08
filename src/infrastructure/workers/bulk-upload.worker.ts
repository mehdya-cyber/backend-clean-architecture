import { TItemBulkUploadJobData } from "../../application/commands/item/item.command";
import { ItemUseCases } from "../../application/use-cases/item/item.use-cases";
import { container } from "../../core/container/container";
import { CONTAINER_TYPES } from "../../core/container/container.types";
import { GenericWorker } from "./worker";

export const startItemsBulkUploadWorker = () => {
  const worker = new GenericWorker<TItemBulkUploadJobData>(
    "items-bulk-upload",
    async (job) => {
      await container
        .get<ItemUseCases>(CONTAINER_TYPES.ItemUseCases)
        .proccessItemsBulkUpload({
          bulkUploadId: job.data.bulkUploadId,
          data: job.data.items,
        });
    },
    {
      concurrency: 3,
    },
  );

  return worker;
};
