require("express-async-errors");
import { config } from "./config";
import { createApp } from "./createApp";
import { knex } from "./db/knex";

const { port } = config();

createApp({ port, dbContext: knex });
