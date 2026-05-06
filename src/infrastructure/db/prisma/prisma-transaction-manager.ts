import { injectable } from "inversify";
import { ITransactionManager } from "../../../core/interfaces/transaction-manager.interfaces";
import { TransactionContext } from "../../../core/types/transaction-context.types";
import { prisma } from "../../../core/config/prisma";

@injectable()
export class PrismaTransactionManager implements ITransactionManager {
  runInTransaction<T>(
    callback: (tx: TransactionContext) => Promise<T>,
  ): Promise<T> {
    return prisma.$transaction(async (tx) => {
      return callback(tx);
    });
  }
}
