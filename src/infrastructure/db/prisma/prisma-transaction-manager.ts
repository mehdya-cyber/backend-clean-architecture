import { injectable } from "inversify";
import { ITransactionManager } from "../../../application/ports/transaction-manager.port";
import { TransactionContext } from "../../../core/types/transaction-context.types";
import { prisma } from "./prisma";

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
