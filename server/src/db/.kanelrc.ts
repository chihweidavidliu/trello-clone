import { Config, generateIndexFile } from "kanel";
const {
  generateKnexTablesModule,
  knexTypeFilter,
  generateMigrationCheck,
} = require("kanel-knex");
import { config } from "../config";

/** @type {import('kanel').Config} */
const kanelConfig: Config = {
  connection: config().databaseUrl || "",
  preDeleteOutputFolder: true,
  outputPath: "./src/db/generated-types",
  preRenderHooks: [
    generateMigrationCheck,
    generateIndexFile,
    generateKnexTablesModule,
  ],
  typeFilter: knexTypeFilter,

  customTypeMap: {
    "pg_catalog.tsvector": "string",
    "pg_catalog.bpchar": "string",
  },
};

export default kanelConfig;
