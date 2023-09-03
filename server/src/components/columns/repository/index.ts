import { Knex } from "knex";
import { Ticket, TicketInitializer } from "../../../db/generated-types";

export interface ColumnsRepositoryProps {
  dbContext: Knex;
}

export interface ColumnsRepository {}

export class ColumnsRepository {
  private dbContext: Knex;

  constructor({ dbContext }: ColumnsRepositoryProps) {
    this.dbContext = dbContext;
  }

  async updateTicketsOrder(tickets: TicketInitializer[]): Promise<Ticket[]> {
    const updatedRows = await this.dbContext
      .table("ticket")
      .insert(tickets)
      .onConflict("id")
      .merge()
      .returning("*");

    return updatedRows;
  }
}
