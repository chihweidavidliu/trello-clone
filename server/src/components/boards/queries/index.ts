import { Knex } from "knex";
import groupBy from "lodash/groupBy";
import { BadRequestError } from "../../../errors/bad-request-error";
import { BoardDTO, ColumnDTO, TicketDTO } from "shared-utils";

export interface BoardIncludeOptions {
  columns: boolean;
  tickets: boolean;
}

export interface BoardsQueriesProps {
  dbContext: Knex;
}

export interface BoardsQueries {}

export class BoardsQueries {
  private dbContext: Knex;

  constructor({ dbContext }: BoardsQueriesProps) {
    this.dbContext = dbContext;
  }

  parseIncludeOptions(includeOptions?: BoardIncludeOptions) {
    return {
      columns: includeOptions?.columns
        ? {
            include: includeOptions.tickets
              ? {
                  tickets: {
                    include: {
                      assignedToUsers: true,
                    },
                  },
                }
              : undefined,
          }
        : undefined,
    };
  }

  async getById(
    id: string,
    options?: {
      include?: BoardIncludeOptions;
    }
  ): Promise<BoardDTO | null> {
    const board = await this.dbContext
      .table("board")
      .select("*")
      .where("id", id)
      .first();

    if (!board) {
      throw new BadRequestError("Error reading board");
    }

    let columns: ColumnDTO[] = [];
    if (options?.include?.columns) {
      const rawColumnns = await this.dbContext
        .table("board_column")
        .select("*")
        .where("boardId", board.id)
        .orderBy("index", "asc");

      let tickets: TicketDTO[] = [];

      if (options?.include?.tickets) {
        const colIds = rawColumnns.map((col) => col.id);

        const rawTickets = await this.dbContext
          .table("ticket")
          .select("*")
          .whereIn("columnId", colIds)
          .orderBy("index", "asc");

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
      }

      const ticketsByColId = groupBy(tickets, "columnId");

      columns = rawColumnns.map((rawCol) => ({
        ...rawCol,
        tickets: ticketsByColId[rawCol.id] || [],
      }));
    }

    return { ...board, columns };
  }
}
