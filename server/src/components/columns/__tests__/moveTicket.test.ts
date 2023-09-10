import request from "supertest";
import { v4 as uuid } from "uuid";
import { createApp } from "../../../createApp";
import { config } from "../../../config";
import {
  createTestBoard,
  createTestTicket,
} from "../../../utils/test-utils/createTestBoard";
import { knex } from "../../../db/knex";
import { MoveTicketPayload } from "shared-utils";

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

const createTestEndpoint = (ticketId: string) =>
  `/columns/move-ticket/${ticketId}`;

describe("PATCH /columns/move-ticket/:ticketId", () => {
  it("should return 500 if the sourceCol can't be retrieved", async () => {
    const ticketId = uuid();
    const colId = uuid();
    const payload: MoveTicketPayload = {
      sourceColId: colId,
      newColId: colId,
      newIndex: 1,
    };
    const response = await request(app)
      .patch(createTestEndpoint(ticketId))
      .send(payload);

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({
      errors: [
        {
          message: `Could not find column with id ${colId}`,
        },
      ],
      data: null,
    });
  });

  it("should return 400 if the ticket can't be retrieved", async () => {
    const ticketId = uuid(); // doesn't exist
    const { columns } = await createTestBoard(knex, "test-user-woo");
    const sourceCol = columns[0];
    const targetCol = columns[1];

    const payload: MoveTicketPayload = {
      sourceColId: sourceCol.id,
      newColId: targetCol.id,
      newIndex: 0,
    };

    const response = await request(app)
      .patch(createTestEndpoint(ticketId))
      .send(payload);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: [
        {
          message: `Failed to remove ticket ${ticketId} from column ${sourceCol.id}`,
        },
      ],
      data: null,
    });
  });

  it("should return 200 and move ticket from one board to another", async () => {
    const { columns, ticket } = await createTestBoard(knex, "test-user-woo");

    const sourceCol = columns[0];
    const targetCol = columns[1];

    const payload: MoveTicketPayload = {
      sourceColId: sourceCol.id,
      newColId: targetCol.id,
      newIndex: 0,
    };

    const response = await request(app)
      .patch(createTestEndpoint(ticket.id))
      .send(payload);

    expect(response.status).toEqual(200);
    const updatedTicket = await knex
      .table("ticket")
      .select("*")
      .where("id", ticket.id)
      .first();
    expect(updatedTicket?.columnId).toEqual(targetCol.id);
    expect(updatedTicket?.index).toEqual(0);
  });

  it("should return 200 and move ticket within a board", async () => {
    const { columns, ticket } = await createTestBoard(knex, "test-user-woo");
    const sourceCol = columns[0];

    const [secondTicket] = await createTestTicket(knex, {
      title: "second ticket",
      description: "woo",
      index: 1,
      columnId: sourceCol.id,
      createdByUserId: "test-user-woo",
    });

    expect(secondTicket?.index).toEqual(1);

    const payload: MoveTicketPayload = {
      sourceColId: sourceCol.id,
      newColId: sourceCol.id,
      newIndex: 1,
    };

    const response = await request(app)
      .patch(createTestEndpoint(ticket.id))
      .send(payload);

    expect(response.status).toEqual(200);

    const updatedTicket = await knex
      .table("ticket")
      .select("*")
      .where("id", ticket.id)
      .first();

    expect(updatedTicket?.columnId).toEqual(sourceCol.id);
    expect(updatedTicket?.index).toEqual(1);

    const updatedSecondTicket = await knex
      .table("ticket")
      .select("*")
      .where("id", secondTicket.id)
      .first();

    expect(updatedSecondTicket?.index).toEqual(0);
  });

  it.todo("should return 401 if user is not authenticated");

  it.todo(
    "should return 401 if user does not have permission to edit the board"
  );
});
