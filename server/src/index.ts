require("express-async-errors");
import { PrismaClient } from "@prisma/client";
import { config } from "./config";
import { createApp } from "./createApp";

const { port } = config();

createApp({ port, dbContext: new PrismaClient() });
