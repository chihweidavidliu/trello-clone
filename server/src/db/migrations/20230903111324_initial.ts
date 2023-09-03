import { Knex } from "knex";

const ON_UPDATE_TIMESTAMP_FUNCTION = `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updatedAt = now();
    RETURN NEW;
  END;
$$ language 'plpgsql';
`;

const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION on_update_timestamp`;

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  await knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP EXTENSION "uuid-ossp";`);
  await knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
}
