import { IAuditLog } from "../entities/audit-log/audit-log.entity";
import { TransactionContext } from "../../core/types/transaction-context.types";

export interface IAuditLogRepository {
  create(
    log: Pick<
      IAuditLog,
      "actorId" | "action" | "entity" | "entityId" | "metadata"
    >,
    tx?: TransactionContext,
  ): Promise<void>;
}
