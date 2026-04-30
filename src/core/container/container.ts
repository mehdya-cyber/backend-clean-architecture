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
import { AuthController } from "../../interface/http/controllers/auth.controller";
import { ItemController } from "../../interface/http/controllers/item.controller";
import { UserController } from "../../interface/http/controllers/user.controller";
import { AuthMiddleware } from "../../interface/http/middleware/auth.middleware";

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

// USE CASES BINDINGS
container.bind<AuthUseCases>(CONTAINER_TYPES.AuthUseCases).to(AuthUseCases);
container.bind<ItemUseCases>(CONTAINER_TYPES.ItemUseCases).to(ItemUseCases);
container.bind<UserUseCases>(CONTAINER_TYPES.UserUseCases).to(UserUseCases);

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
