// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { Knex } from 'knex';

/** This is the migration that was set when the types were generated. */
export const sourceMigration = '20230903113719_initial-tables.ts';

/** Gets the migration in the live database */
export const getCurrentMigration = async (knex: Knex): Promise<string> => {
  const [{ name }] = await knex
    .select('name')
    .from('knex_migrations')
    .orderBy('migration_time', 'DESC')
    .limit(1);
  return name;
};

/** Check that the migration in the live database matches the code */
export const validateMigration = async (knex: Knex): Promise<void> => {
  const currentMigration = await getCurrentMigration(knex);
  if (currentMigration !== sourceMigration) {
    throw new Error(`Current migration is ${currentMigration}, but source migration is ${sourceMigration}`);
  }
};
