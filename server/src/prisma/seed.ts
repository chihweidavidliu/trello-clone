import { PrismaClient } from "@prisma/client";

// TODO: moved this to shared utils rbac
export enum UserRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

const prisma = new PrismaClient();
async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: UserRole.ADMIN },
    update: {},
    create: {
      name: UserRole.ADMIN,
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: UserRole.EDITOR },
    update: {},
    create: {
      name: UserRole.EDITOR,
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: UserRole.VIEWER },
    update: {},
    create: {
      name: UserRole.VIEWER,
    },
  });
  console.log({ adminRole, editorRole, viewerRole });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
