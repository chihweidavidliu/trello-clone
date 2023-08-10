import request from "supertest";
import { v4 as uuid } from "uuid";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../../../createApp";
import { config } from "../../../config";

const { port, databaseUrl } = config();
console.log("databaseUrl", databaseUrl);
const client = new PrismaClient();
const { app, server } = createApp({ port, dbContext: client });

afterAll(() => {
  server.close();
});

afterEach(async () => {
  await client.ticket.deleteMany();
  await client.column.deleteMany();
  await client.boardUserRole.deleteMany();
  await client.board.deleteMany();
});

const createTestBoard = async (userId: string) => {
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

describe("GET /boards/:boardId", () => {
  it("should return 400 if board does not exist", async () => {
    const badUuid = uuid();
    const response = await request(app).get("/boards/" + badUuid);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: [
        {
          message: `Could not find board with id ${badUuid}`,
        },
      ],
      data: null,
    });
  });

  it.todo("should return 401 if user is not authenticated");

  it.todo(
    "should return 401 if user does not have permission to view the board"
  );

  it("should return 200 and board if user has view permissions on the board", async () => {
    const { board } = await createTestBoard("test-user-woo");
    const response = await request(app).get("/boards/" + board.id);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      errors: null,
      data: {
        board: {
          ...board,
          createdAt: board.createdAt.toISOString(),
        },
      },
    });
  });

  it("should include columns if 'include' query param is specified with 'columns'", async () => {
    const { board, toDoColumn, inProgressCol, completedCol } =
      await createTestBoard("test-user-woo");
    const response = await request(app).get(
      "/boards/" + board.id + "?include=columns"
    );
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      errors: null,
      data: {
        board: {
          ...board,
          createdAt: board.createdAt.toISOString(),
          columns: [toDoColumn, inProgressCol, completedCol],
        },
      },
    });
  });

  it("should include tickets if 'include' query param is specified with 'columns' and 'tickets'", async () => {
    const { board, toDoColumn, inProgressCol, completedCol } =
      await createTestBoard("test-user-woo");
    const response = await request(app).get(
      "/boards/" + board.id + "?include=columns,tickets"
    );

    const todoTicket = await client.ticket.findFirst({
      where: { columnId: toDoColumn.id },
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      errors: null,
      data: {
        board: {
          ...board,
          createdAt: board.createdAt.toISOString(),
          columns: [
            {
              ...toDoColumn,
              tickets: [
                {
                  ...todoTicket,
                  createdAt: todoTicket?.createdAt.toISOString(),
                  updatedAt: todoTicket?.updatedAt.toISOString(),
                },
              ],
            },
            { ...inProgressCol, tickets: [] },
            { ...completedCol, tickets: [] },
          ],
        },
      },
    });
  });

  it("should NOT include tickets if 'include' query param is specified with 'tickets' onlu", async () => {
    const { board, toDoColumn, inProgressCol, completedCol } =
      await createTestBoard("test-user-woo");
    const response = await request(app).get(
      "/boards/" + board.id + "?include=tickets"
    );

    const todoTicket = await client.ticket.findFirst({
      where: { columnId: toDoColumn.id },
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      errors: null,
      data: {
        board: {
          ...board,
          createdAt: board.createdAt.toISOString(),
        },
      },
    });
  });
});
