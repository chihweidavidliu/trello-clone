import { Knex } from "knex";
import { v4 as uuid } from "uuid";
import { BoardId, ColumnId, TicketId } from "../../db/generated-types";

export const createTestBoard = async (client: Knex, userId: string) => {
  const board = await client
    .table("Board")
    .insert([
      {
        id: uuid() as BoardId,
        title: "Test board",
        createdByUserId: userId,
      },
    ])
    .returning("*")
    .first();

  if (!board) {
    throw new Error("Error creating board");
  }

  const columns = await client
    .table("Column")
    .insert([
      {
        id: uuid() as ColumnId,
        title: "To do",
        boardId: board.id,
        index: 0,
      },
      {
        id: uuid() as ColumnId,
        title: "In progress",
        boardId: board.id,
        index: 1,
      },
      {
        id: uuid() as ColumnId,
        title: "Completed",
        boardId: board.id,
        index: 2,
      },
    ])
    .returning("*");

  if (!columns || columns.length < 1) {
    throw new Error("Error creating test columns");
  }

  await client.table("Ticket").insert([
    {
      id: uuid() as TicketId,
      columnId: columns[0].id,
      title: "Add tests",
      description: "This is a description",
      createdByUserId: userId,
      index: 0,
    },
  ]);

  return { board, columns };
};
