import { Knex } from "knex";

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

  await client.table("ticket").insert([
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
