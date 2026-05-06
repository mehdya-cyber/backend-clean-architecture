export const CONTAINER_TYPES = {
  //REPOSITORIES
  UserRepository: Symbol.for("UserRepository"),
  TokenRepository: Symbol.for("TokenRepository"),
  ItemRepository: Symbol.for("ItemRepository"),
  AuditLogRepository: Symbol.for("AuditLogRepository"),
  BulkUploadRepository: Symbol.for("BulkUploadRepository"),
  TransactionManager: Symbol.for("TransactionManager"),

  // USE CASES
  UserUseCases: Symbol.for("UserUseCases"),
  AuthUseCases: Symbol.for("AuthUseCases"),
  ItemUseCases: Symbol.for("ItemUseCases"),

  // CONTROLLERS
  UserController: Symbol.for("UserController"),
  AuthController: Symbol.for("AuthController"),
  ItemController: Symbol.for("ItemController"),

  // MIDDLEWARE
  AuthMiddleware: Symbol.for("AuthMiddleware"),

  // SERVICES
  QueueService: Symbol.for("QueueService"),
  FileParser: Symbol.for("FileParser"),
};
