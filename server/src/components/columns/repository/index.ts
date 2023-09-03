import { Knex } from "knex";

export interface ColumnsRepositoryProps {
  dbContext: Knex;
}

export interface ColumnsRepository {}

export class ColumnsRepository {
  private dbContext: Knex;

  constructor({ dbContext }: ColumnsRepositoryProps) {
    this.dbContext = dbContext;
  }

  async updateTicketsOrder() {}
}
