import { IAuditLog } from "../../../../../domain/entities/audit-log/audit-log.entity";
import { IAuditLogRepository } from "../../../../../domain/interfaces/audit-log-repository.interface";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../prisma";

export class AuditLogRepository implements IAuditLogRepository {
  constructor() {}

  create = async (
    data: Pick<
      IAuditLog,
      "actorId" | "action" | "entity" | "entityId" | "metadata"
    >,
  ) => {
    await prisma.auditLog.create({
      data: {
        actorId: data.actorId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        metadata: data.metadata as Prisma.InputJsonValue,
      },
    });
  };
}
