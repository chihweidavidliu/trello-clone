import { config as appConfig } from "../config";

// Update with your config settings.

module.exports = {
  client: "pg",
  connection: {
    connectionString: appConfig().databaseUrl,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
