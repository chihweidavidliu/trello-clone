import request from "supertest";
import { v4 as uuid } from "uuid";
import { PrismaClient } from "@prisma/client";
import { createApp } from "../../../createApp";
import { config } from "../../../config";

const { port, databaseUrl } = config();

const { app, server } = createApp({ port, dbContext: new PrismaClient() });

afterAll(() => {
  server.close();
});

describe("GET /boards/:boardId", () => {
  it("should return 400 if board does not exist", async () => {
    console.log("databaseUrl", databaseUrl);
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

  it.todo(
    "should return 200 and board if user has view permissions on the board"
  );
});
