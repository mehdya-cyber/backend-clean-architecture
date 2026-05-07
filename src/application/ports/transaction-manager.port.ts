import { TransactionContext } from "../../core/types/transaction-context.types";

export interface ITransactionManager {
  runInTransaction<T>(fn: (tx: TransactionContext) => Promise<T>): Promise<T>;
}
