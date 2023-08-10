import { PrismaClient } from "@prisma/client";

export const createTestBoard = async (client: PrismaClient, userId: string) => {
  const board = await client.board.create({
    data: {
      title: "Test board",
      createdByUserId: userId,
    },
  });

  const toDoColumn = await client.column.create({
    data: {
      title: "To do",
      boardId: board.id,
      index: 0,
      tickets: {
        create: {
          title: "Add tests",
          description: "This is a description",
          createdByUserId: userId,
          index: 0,
        },
      },
    },
  });

  const inProgressCol = await client.column.create({
    data: {
      title: "In progress",
      boardId: board.id,
      index: 1,
    },
  });

  const completedCol = await client.column.create({
    data: {
      title: "Completed",
      boardId: board.id,
      index: 2,
    },
  });

  return { board, toDoColumn, inProgressCol, completedCol };
};
