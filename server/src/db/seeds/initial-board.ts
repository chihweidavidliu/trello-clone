import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex.table("ticket_assigned_to_user").delete();
  await knex.table("ticket").delete();
  await knex.table("board_column").delete();
  await knex.table("board_user_role").delete();
  await knex.table("board").delete();

  // Inserts seed entries
  const [board] = await knex("board")
    .insert([
      {
        title: "Test board",
        createdByUserId: "test-user",
      },
    ])
    .returning("*");

  if (!board) {
    throw new Error("Failed to create board");
  }

  const columns = await knex("board_column")
    .insert([
      {
        title: "To do",
        boardId: board.id,
        index: 0,
      },
      {
        title: "In progress",
        boardId: board.id,
        index: 1,
      },
      {
        title: "Completed",
        boardId: board.id,
        index: 2,
      },
    ])
    .returning("*");

  const [ticket] = await knex("ticket")
    .insert([
      {
        title: "Add tests",
        description: "This is a description",
        createdByUserId: "test-user",
        index: 0,
        columnId: columns[0].id,
      },
    ])
    .returning("*");

  if (!ticket) {
    throw new Error("Failed to create ticket");
  }

  const assignedToUsers = await knex("ticket_assigned_to_user").insert([
    {
      userId: "test-user",
      ticketId: ticket.id,
    },
  ]);

  console.log({
    board,
    columns,
    assignedToUsers,
  });
}
