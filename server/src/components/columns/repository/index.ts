import { Knex } from "knex";
import groupBy from "lodash/groupBy";

import { Ticket } from "../../../db/generated-types";
import { ColumnDTO, TicketDTO } from "shared-utils";
import { ColumnEntity } from "../column.entity";
import { InternalServerError } from "../../../errors/internal-server-error";

export interface ColumnsRepositoryProps {
  dbContext: Knex;
}

export interface ColumnsRepository {}

export class ColumnsRepository {
  private dbContext: Knex;

  constructor({ dbContext }: ColumnsRepositoryProps) {
    this.dbContext = dbContext;
  }

  // async getTicketById(id: string): Promise<TicketDTO | null> {
  //   const rawTicket = await this.dbContext
  //     .table("ticket")
  //     .select("*")
  //     .where("id", id)
  //     .first();

  //   if (!rawTicket) return null;

  //   const assignedToUsers = await this.dbContext
  //     .table("ticket_assigned_to_user")
  //     .select("*")
  //     .where("ticketId", rawTicket?.id);

  //   return {
  //     ...rawTicket,
  //     assignedToUsers,
  //   };
  // }

  async getColumnsById(ids: string[]): Promise<ColumnEntity[]> {
    const rawColumnns = await this.dbContext
      .table("board_column")
      .select("*")
      .whereIn("id", ids);

    let columns: ColumnDTO[] = [];
    let tickets: TicketDTO[] = [];

    const colIds = rawColumnns.map((col) => col.id);

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

    tickets = rawTickets.map((rawTicket) => ({
      ...rawTicket,
      assignedToUsers: assignedToUsersByTicketId[rawTicket.id],
    }));

    const ticketsByColId = groupBy(tickets, "columnId");

    columns = rawColumnns.map((rawCol) => ({
      ...rawCol,
      tickets: ticketsByColId[rawCol.id] || [],
    }));

    return columns.map((c) => ColumnEntity.create(c));
  }

  async save(col: ColumnEntity[] | ColumnEntity): Promise<ColumnEntity[]> {
    try {
      const columns = Array.isArray(col) ? col : [col];
      await this.dbContext.transaction(async (trx) => {
        await trx
          .table("board_column")
          .insert(columns.map((col) => col.toPrimitive()))
          .onConflict("id")
          .merge()
          .returning("*");

        const tickets = columns.reduce((acc, col) => {
          acc = [...acc, ...col.ticketsToPrimitive()];
          return acc;
        }, [] as Ticket[]);

        await trx.table("ticket").insert(tickets);
      });

      return columns;
    } catch (error) {
      throw new InternalServerError("Error saving columns");
    }
  }

  // async updateTicketsOrder(tickets: TicketInitializer[]): Promise<TicketDTO[]> {
  //   const updatedRows = await this.dbContext
  //     .table("ticket")
  //     .insert(tickets)
  //     .onConflict("id")
  //     .merge()
  //     .returning("*");

  //   const assignedToUsers = await this.dbContext
  //     .table("ticket_assigned_to_user")
  //     .select("*")
  //     .where(
  //       "ticketId",
  //       updatedRows.map((row) => row.id)
  //     );

  //   const assignedToUsersByTicketId = groupBy(assignedToUsers, "ticketId");

  //   return updatedRows.map((rawTicket) => ({
  //     ...rawTicket,
  //     assignedToUsers: assignedToUsersByTicketId[rawTicket.id],
  //   }));
  // }
}
