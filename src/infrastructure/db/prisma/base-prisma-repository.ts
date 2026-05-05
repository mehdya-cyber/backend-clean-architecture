import { prisma } from "../../../core/config/prisma";
import { TransactionContext } from "../../../core/types/transaction-context.types";
import { Prisma } from "./generated/prisma/client";

export type PrismaTransactionContext = Prisma.TransactionClient;

export abstract class BasePrismaRepository {
  protected getClient(tx?: TransactionContext) {
    return (tx as PrismaTransactionContext | undefined) ?? prisma;
  }
}
