import type { Knex } from "knex";
import { config as appConfig } from "../config";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      connectionString: appConfig().databaseUrl,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  staging: {
    client: "pg",
    connection: {
      connectionString: "",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: "",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

module.exports = config;
