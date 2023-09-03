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
  await knex.table("TicketAssignedToUser").delete();
  await knex.table("Ticket").delete();
  await knex.table("Column").delete();
  await knex.table("BoardUserRole").delete();
  await knex.table("Board").delete();
});

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
    const { board } = await createTestBoard(knex, "test-user-woo");
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
          columns: columns.map((col) => ({
            ...col,
            createdAt: col.createdAt.toISOString(),
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
      .table("Ticket")
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
          columns: [
            {
              ...toDoColumn,
              createdAt: toDoColumn.createdAt.toISOString(),
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
            },
            {
              ...completedCol,
              tickets: [],
              createdAt: completedCol.createdAt.toISOString(),
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
          createdAt: board.createdAt.toISOString(),
        },
      },
    });
  });
});
