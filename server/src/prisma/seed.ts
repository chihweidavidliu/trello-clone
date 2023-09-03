// import { UserRole } from "shared-utils";

// async function main() {
//   const adminRole = await prisma.role.upsert({
//     where: { name: UserRole.ADMIN },
//     update: {},
//     create: {
//       name: UserRole.ADMIN,
//     },
//   });

//   const editorRole = await prisma.role.upsert({
//     where: { name: UserRole.EDITOR },
//     update: {},
//     create: {
//       name: UserRole.EDITOR,
//     },
//   });

//   const viewerRole = await prisma.role.upsert({
//     where: { name: UserRole.VIEWER },
//     update: {},
//     create: {
//       name: UserRole.VIEWER,
//     },
//   });
//   console.log({ adminRole, editorRole, viewerRole });

//   const board = await prisma.board.create({
//     data: {
//       title: "Test board",
//       createdByUserId: "test-user",
//     },
//   });

//   const toDoColumn = await prisma.column.create({
//     data: {
//       title: "To do",
//       boardId: board.id,
//       index: 0,
//       tickets: {
//         create: {
//           title: "Add tests",
//           description: "This is a description",
//           createdByUserId: "test-user",
//           index: 0,
//           assignedToUsers: {
//             create: {
//               userId: "test-user",
//             },
//           },
//         },
//       },
//     },
//   });

//   const inProgressCol = await prisma.column.create({
//     data: {
//       title: "In progress",
//       boardId: board.id,
//       index: 1,
//     },
//   });

//   const completedCol = await prisma.column.create({
//     data: {
//       title: "Completed",
//       boardId: board.id,
//       index: 2,
//     },
//   });

//   console.log({ board, columns: [toDoColumn, inProgressCol, completedCol] });
// }
// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
