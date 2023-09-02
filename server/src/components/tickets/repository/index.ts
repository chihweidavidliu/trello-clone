import { PrismaClient } from "@prisma/client";

export interface TicketsRepositoryProps {
  dbContext: PrismaClient;
}

export interface TicketsRepository {}

export class TicketsRepository {
  private dbContext: PrismaClient;

  constructor({ dbContext }: TicketsRepositoryProps) {
    this.dbContext = dbContext;
  }
}
