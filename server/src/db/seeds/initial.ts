import { Knex } from "knex";
import { UserRole } from "shared-utils";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("role").del();

  // Inserts seed entries
  await knex("role").insert([
    { name: UserRole.ADMIN },
    { name: UserRole.EDITOR },
    { name: UserRole.VIEWER },
  ]);
}
