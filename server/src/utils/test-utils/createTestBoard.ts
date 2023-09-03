import { Knex } from "knex";

export const createTestBoard = async (client: Knex, userId: string) => {
  const board = await client
    .table("Board")
    .insert([
      {
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

  await client.table("Ticket").insert([
    {
      columnId: columns[0].id,
      title: "Add tests",
      description: "This is a description",
      createdByUserId: userId,
      index: 0,
    },
  ]);

  return { board, columns };
};
