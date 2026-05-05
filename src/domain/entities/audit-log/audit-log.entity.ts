export interface IAuditLog {
  id: string;
  actorId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  actor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export class AuditLogEntity implements IAuditLog {
  id: string;
  actorId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  actor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  constructor(data: IAuditLog) {
    this.id = data.id;
    this.actorId = data.actorId;
    this.action = data.action;
    this.entity = data.entity;
    this.entityId = data.entityId;
    this.metadata = data.metadata;
    this.createdAt = data.createdAt;
    this.actor = data.actor;
  }
}
