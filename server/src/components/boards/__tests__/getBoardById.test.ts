import request from "supertest";
import { v4 as uuid } from "uuid";
import { createApp } from "../../../createApp";
import { config } from "../../../config";
import { createTestBoard } from "../../../utils/test-utils/createTestBoard";
import { knex } from "../../../db/knex";

const { port, databaseUrl } = config();
console.log("databaseUrl", databaseUrl);

const { app, server } = createApp({ port, dbContext: knex });

afterAll(() => {
  server.close();
});

afterEach(async () => {
  await knex.table("ticket_assigned_to_user").delete();
  await knex.table("ticket").delete();
  await knex.table("board_column").delete();
  await knex.table("board_user_role").delete();
  await knex.table("board").delete();
});

describe("GET /boards/:boardId", () => {
  it("should return 400 if board does not exist", async () => {
    const badUuid = uuid();
    const response = await request(app).get("/boards/" + badUuid);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: [
        {
          message: `Error reading board`,
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
    const { board } = await createTestBoard(knex, "test-user-woo");
    const response = await request(app).get("/boards/" + board.id);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      errors: null,
      data: {
        board: {
          ...board,
          columns: [],
          createdAt: board.createdAt.toISOString(),
          updatedAt: board.updatedAt.toISOString(),
        },
      },
    });
  });

  it("should include columns if 'include' query param is specified with 'columns'", async () => {
    const { board, columns } = await createTestBoard(knex, "test-user-woo");
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
          updatedAt: board.updatedAt.toISOString(),
          columns: columns.map((col) => ({
            ...col,
            tickets: [],
            createdAt: col.createdAt.toISOString(),
            updatedAt: col.updatedAt.toISOString(),
          })),
        },
      },
    });
  });

  it("should include tickets if 'include' query param is specified with 'columns' and 'tickets'", async () => {
    const { board, columns } = await createTestBoard(knex, "test-user-woo");
    const response = await request(app).get(
      "/boards/" + board.id + "?include=columns,tickets"
    );

    const toDoColumn = columns[0];
    const inProgressCol = columns[1];
    const completedCol = columns[2];

    const todoTicket = await knex
      .table("ticket")
      .select("*")
      .where("columnId", toDoColumn.id)
      .first();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      errors: null,
      data: {
        board: {
          ...board,
          createdAt: board.createdAt.toISOString(),
          updatedAt: board.updatedAt.toISOString(),
          columns: [
            {
              ...toDoColumn,
              createdAt: toDoColumn.createdAt.toISOString(),
              updatedAt: toDoColumn.updatedAt.toISOString(),
              tickets: [
                {
                  ...todoTicket,
                  createdAt: todoTicket?.createdAt.toISOString(),
                  updatedAt: todoTicket?.updatedAt.toISOString(),
                },
              ],
            },
            {
              ...inProgressCol,
              tickets: [],
              createdAt: inProgressCol.createdAt.toISOString(),
              updatedAt: inProgressCol.updatedAt.toISOString(),
            },
            {
              ...completedCol,
              tickets: [],
              createdAt: completedCol.createdAt.toISOString(),
              updatedAt: completedCol.updatedAt.toISOString(),
            },
          ],
        },
      },
    });
  });

  it("should NOT include tickets if 'include' query param is specified with 'tickets' only", async () => {
    const { board } = await createTestBoard(knex, "test-user-woo");
    const response = await request(app).get(
      "/boards/" + board.id + "?include=tickets"
    );

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      errors: null,
      data: {
        board: {
          ...board,
          columns: [],
          createdAt: board.createdAt.toISOString(),
          updatedAt: board.updatedAt.toISOString(),
        },
      },
    });
  });
});
