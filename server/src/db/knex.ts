import { config } from "../config";

export const knex = require("knex")({
  client: "pg",
  connection: {
    connectionString: config().databaseUrl,
  },
});
