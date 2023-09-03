import { config } from "../config";
import { knex as createKnex } from "knex";

export const knex = createKnex({
  client: "pg",
  connection: {
    connectionString: config().databaseUrl,
  },
});
