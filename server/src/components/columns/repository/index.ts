import { Knex } from "knex";
import groupBy from "lodash/groupBy";

import { Ticket } from "../../../db/generated-types";
import { TicketDTO } from "shared-utils";
import { ColumnAggregate } from "../domain/column.aggregate";
import { InternalServerError } from "../../../errors/internal-server-error";
import { columnMapper } from "../domain/column.mapper";
import { TicketEntity } from "../domain/ticket.entity";
import { ticketMapper } from "../domain/ticket.mapper";

export interface ColumnsRepositoryProps {
  dbContext: Knex;
}

export interface ColumnsRepository {}

export class ColumnsRepository {
  private dbContext: Knex;

  constructor({ dbContext }: ColumnsRepositoryProps) {
    this.dbContext = dbContext;
  }

  async getColumnsById(ids: string[]): Promise<ColumnAggregate[]> {
    const rawCols = await this.dbContext
      .table("board_column")
      .select("*")
      .whereIn("id", ids);

    let tickets: TicketEntity[] = [];

    const colIds = rawCols.map((col) => col.id);

    const rawTickets = await this.dbContext
      .table("ticket")
      .select("*")
      .whereIn("columnId", colIds);

    const ticketIds = rawTickets.map((ticket) => ticket.id);

    const assignedToUsers = await this.dbContext
      .table("ticket_assigned_to_user")
      .select("*")
      .whereIn("ticketId", ticketIds);

    const assignedToUsersByTicketId = groupBy(assignedToUsers, "ticketId");

    tickets = rawTickets.map((rawTicket) =>
      ticketMapper.toDomain(rawTicket, assignedToUsersByTicketId[rawTicket.id])
    );

    const ticketsByColId = groupBy(tickets, "columnId");

    return rawCols.map((rawCol) =>
      columnMapper.toDomain(rawCol, ticketsByColId[rawCol.id])
    );
  }

  async save(
    col: ColumnAggregate[] | ColumnAggregate
  ): Promise<ColumnAggregate[]> {
    try {
      const columns = Array.isArray(col) ? col : [col];
      await this.dbContext.transaction(async (trx) => {
        await trx
          .table("board_column")
          .insert(columns.map((col) => columnMapper.toPersistence(col)))
          .onConflict("id")
          .merge()
          .returning("*");

        const tickets = columns.reduce((acc, col) => {
          const ticketsForCol = col.tickets.map((t) =>
            ticketMapper.toPersistence(t)
          );
          acc = [...acc, ...ticketsForCol];
          return acc;
        }, [] as Ticket[]);

        await trx.table("ticket").insert(tickets);
      });

      return columns;
    } catch (error) {
      throw new InternalServerError("Error saving columns");
    }
  }
}
