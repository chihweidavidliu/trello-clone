require("express-async-errors");
import { config } from "./config";
import { createApp } from "./createApp";
import { validateMigration } from "./db/generated-types/migration-check";
import { knex } from "./db/knex";

const { port } = config();

const run = async () => {
  await validateMigration(knex);
  createApp({ port, dbContext: knex });
};

run();
