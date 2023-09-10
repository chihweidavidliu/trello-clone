import { Knex } from "knex";
import { Ticket, TicketInitializer } from "../../db/generated-types";

export const createTestBoard = async (client: Knex, userId: string) => {
  const [board] = await client
    .table("board")
    .insert([
      {
        title: "Test board",
        createdByUserId: userId,
      },
    ])
    .returning("*");

  if (!board) {
    throw new Error("Error creating board");
  }

  const columns = await client
    .table("board_column")
    .insert([
      {
        title: "To do",
        boardId: board.id,
        index: 0,
      },
      {
        title: "In progress",
        boardId: board.id,
        index: 1,
      },
      {
        title: "Completed",
        boardId: board.id,
        index: 2,
      },
    ])
    .returning("*");

  if (!columns || columns.length < 1) {
    throw new Error("Error creating test columns");
  }

  const [ticket] = await createTestTicket(client, [
    {
      columnId: columns[0].id,
      title: "Add tests",
      description: "This is a description",
      createdByUserId: userId,
      index: 0,
    },
  ]);

  return { board, columns, ticket };
};

export const createTestTicket = async (
  client: Knex,
  tickets: TicketInitializer[] | TicketInitializer
): Promise<Ticket[]> => {
  const rows = await client.table("ticket").insert(tickets).returning("*");
  return rows;
};
