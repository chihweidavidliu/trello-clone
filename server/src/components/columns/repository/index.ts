import { Knex } from "knex";
import groupBy from "lodash/groupBy";

import { BoardColumn, Ticket } from "../../../db/generated-types";
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

    const tickets: TicketEntity[] = rawTickets.map((rawTicket) =>
      ticketMapper.toDomain(rawTicket, assignedToUsersByTicketId[rawTicket.id])
    );

    const ticketsByColId = groupBy(tickets, "columnId");

    return rawCols.map((rawCol) => {
      const ticketsForCol = ticketsByColId[rawCol.id];
      return columnMapper.toDomain(rawCol, ticketsForCol);
    });
  }

  async save(
    col: ColumnAggregate[] | ColumnAggregate
  ): Promise<ColumnAggregate[]> {
    try {
      const columns = Array.isArray(col) ? col : [col];

      const updatedCols = await this.dbContext.transaction(async (trx) => {
        const ticketInserts = columns.reduce<Ticket[]>((acc, col) => {
          const ticketsForCol = col.tickets.map((t) =>
            ticketMapper.toPersistence(t)
          );
          acc = [...acc, ...ticketsForCol];
          return acc;
        }, []);


        await trx
          .table("ticket")
          .insert(ticketInserts)
          .onConflict("id")
          .merge(["index", "title", "description", "columnId", "updatedAt"]);

        const colInserts: BoardColumn[] = columns.map((col) =>
          columnMapper.toPersistence(col)
        );

        await trx
          .table("board_column")
          .insert(colInserts)
          .onConflict("id")
          .merge(["index", "title", "boardId", "updatedAt"])
          .returning("*");

        return columns;
      });

      return updatedCols;
    } catch (error) {
      throw new InternalServerError(
        `Error saving columns ${error instanceof Error ? error?.message : ""}`
      );
    }
  }
}
