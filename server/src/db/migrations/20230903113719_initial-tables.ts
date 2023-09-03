import { Knex } from "knex";
import { dropOnUpdateTrigger, onUpdateTrigger } from "../migration-helpers";

export async function up(knex: Knex): Promise<void> {
  knex.schema
    .createTable("board", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.text("title").notNullable();
      table.text("createdByUserId").notNullable();
      table.timestamps(true, true, true);
    })
    .createTable("column", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.text("title").notNullable();
      table.uuid("boardId").notNullable().references("id").inTable("board");
      table.integer("index").notNullable();
      table.timestamps(true, true, true);
    })
    .createTable("ticket", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.text("title").notNullable();
      table.text("description");
      table.uuid("columnId").notNullable().references("id").inTable("column");
      table.integer("index").notNullable();
      table.text("createdByUserId").notNullable();
      table.timestamps(true, true, true);
    })
    .createTable("role", (table) => {
      table.increments().primary();
      table.text("name").notNullable();
      table.timestamps(true, true, true);
    })
    .createTable("ticket_assigned_to_user", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.text("userId").notNullable();
      table.uuid("ticketId").notNullable().references("id").inTable("ticket");
      table.timestamps(true, true, true);
    })
    .createTable("board_user_role", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.text("userId").notNullable();
      table.uuid("boardId").notNullable().references("id").inTable("board");
      table.integer("roleId").notNullable().references("id").inTable("role");
      table.timestamps(true, true, true);
    });

  // add update triggers
  await knex.raw(onUpdateTrigger("board"));
  await knex.raw(onUpdateTrigger("column"));
  await knex.raw(onUpdateTrigger("ticket"));
  await knex.raw(onUpdateTrigger("role"));
  await knex.raw(onUpdateTrigger("ticket_assigned_to_user"));
  await knex.raw(onUpdateTrigger("board_user_role"));
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(dropOnUpdateTrigger("board"));
  await knex.raw(dropOnUpdateTrigger("column"));
  await knex.raw(dropOnUpdateTrigger("ticket"));
  await knex.raw(dropOnUpdateTrigger("role"));
  await knex.raw(dropOnUpdateTrigger("ticket_assigned_to_user"));
  await knex.raw(dropOnUpdateTrigger("board_user_role"));

  knex.schema.dropTable("board_user_role");
  knex.schema.dropTable("ticket_assigned_to_user");
  knex.schema.dropTable("role");
  knex.schema.dropTable("ticket");
  knex.schema.dropTable("column");
  knex.schema.dropTable("board");
}
