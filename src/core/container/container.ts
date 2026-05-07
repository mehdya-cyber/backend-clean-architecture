import { Container } from "inversify";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface";
import { CONTAINER_TYPES } from "./container.types";
import { UserRepository } from "../../infrastructure/db/prisma/repository/user/user.repository";
import { IItemRepository } from "../../domain/interfaces/item-repository.interface";
import { ItemRepository } from "../../infrastructure/db/prisma/repository/item/item.repository";
import { ITokenRepository } from "../../domain/interfaces/token-repository.interface";
import { TokenRepository } from "../../infrastructure/db/prisma/repository/token/token.repository";
import { AuthUseCases } from "../../application/use-cases/auth/auth.use-cases";
import { ItemUseCases } from "../../application/use-cases/item/item.use-cases";
import { UserUseCases } from "../../application/use-cases/user/user.use-cases";
import { AuthController } from "../../presentation/http/controllers/auth.controller";
import { ItemController } from "../../presentation/http/controllers/item.controller";
import { UserController } from "../../presentation/http/controllers/user.controller";
import { AuthMiddleware } from "../../presentation/http/middleware/auth.middleware";
import { IAuditLogRepository } from "../../domain/interfaces/audit-log-repository.interface";
import { AuditLogRepository } from "../../infrastructure/db/prisma/repository/audit-log/audit-log.repository";
import { ITransactionManager } from "../../application/ports/transaction-manager.port";
import { PrismaTransactionManager } from "../../infrastructure/db/prisma/prisma-transaction-manager";
import { IBulkUploadRepository } from "../../domain/interfaces/bulk-upload-repository.interface";
import { BulkUploadRepository } from "../../infrastructure/db/prisma/repository/bulk-upload/bulk-upload.repository";
import { IQueueService } from "../../application/ports/queue-service.port";
import { ItemsBulkUploadQueue } from "../../infrastructure/queues/instances";
import { CsvFileParser } from "../../infrastructure/services/csv-parser.service";
import { ICsvFileParser } from "../../application/ports/file-parser.port";
import { IHashService } from "../../application/ports/hash-service.port";
import { ICsrfService } from "../../application/ports/csrf.port";
import { IJwtService } from "../../application/ports/jwt.port";

export const container = new Container();

// REPOSITORY BINDINGS
container
  .bind<IUserRepository>(CONTAINER_TYPES.UserRepository)
  .to(UserRepository)
  .inSingletonScope();

container
  .bind<IItemRepository>(CONTAINER_TYPES.ItemRepository)
  .to(ItemRepository)
  .inSingletonScope();

container
  .bind<ITokenRepository>(CONTAINER_TYPES.TokenRepository)
  .to(TokenRepository)
  .inSingletonScope();

container
  .bind<IAuditLogRepository>(CONTAINER_TYPES.AuditLogRepository)
  .to(AuditLogRepository)
  .inSingletonScope();

container
  .bind<IBulkUploadRepository>(CONTAINER_TYPES.BulkUploadRepository)
  .to(BulkUploadRepository)
  .inSingletonScope();

// USE CASES BINDINGS
container
  .bind<AuthUseCases>(CONTAINER_TYPES.AuthUseCases)
  .toDynamicValue(
    (ctx) =>
      new AuthUseCases(
        ctx.get<IUserRepository>(CONTAINER_TYPES.UserRepository),
        ctx.get<ITokenRepository>(CONTAINER_TYPES.TokenRepository),
        ctx.get<IAuditLogRepository>(CONTAINER_TYPES.AuditLogRepository),
        ctx.get<IJwtService>(CONTAINER_TYPES.JwtService),
        ctx.get<ICsrfService>(CONTAINER_TYPES.CsrfService),
        ctx.get<IHashService>(CONTAINER_TYPES.HashService),
      ),
  );

container
  .bind<ItemUseCases>(CONTAINER_TYPES.ItemUseCases)
  .toDynamicValue(
    (ctx) =>
      new ItemUseCases(
        ctx.get<IItemRepository>(CONTAINER_TYPES.ItemRepository),
        ctx.get<IUserRepository>(CONTAINER_TYPES.UserRepository),
        ctx.get<IAuditLogRepository>(CONTAINER_TYPES.AuditLogRepository),
        ctx.get<IBulkUploadRepository>(CONTAINER_TYPES.BulkUploadRepository),
        ctx.get<ITransactionManager>(CONTAINER_TYPES.TransactionManager),
        ctx.get<IQueueService>(CONTAINER_TYPES.QueueService),
        ctx.get<IHashService>(CONTAINER_TYPES.HashService),
      ),
  );

container
  .bind<UserUseCases>(CONTAINER_TYPES.UserUseCases)
  .toDynamicValue(
    (ctx) =>
      new UserUseCases(
        ctx.get<IUserRepository>(CONTAINER_TYPES.UserRepository),
        ctx.get<IAuditLogRepository>(CONTAINER_TYPES.AuditLogRepository),
        ctx.get<IHashService>(CONTAINER_TYPES.HashService),
      ),
  );

// CONTROLLER BINDINGS
container.bind(CONTAINER_TYPES.AuthController).to(AuthController);
container.bind(CONTAINER_TYPES.ItemController).to(ItemController);
container.bind(CONTAINER_TYPES.UserController).to(UserController);

// MIDDLEWARE BINDINGS
container
  .bind<AuthMiddleware>(CONTAINER_TYPES.AuthMiddleware)
  .to(AuthMiddleware)
  .inSingletonScope();

// SERVICE BINDINGS
container
  .bind<ITransactionManager>(CONTAINER_TYPES.TransactionManager)
  .to(PrismaTransactionManager)
  .inSingletonScope();

container
  .bind<IQueueService>(CONTAINER_TYPES.QueueService)
  .toConstantValue(ItemsBulkUploadQueue);

container
  .bind<ICsvFileParser>(CONTAINER_TYPES.FileParser)
  .to(CsvFileParser)
  .inSingletonScope();
