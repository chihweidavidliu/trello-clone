require("express-async-errors");
import { config } from "./config";
import { createApp } from "./createApp";

const { port } = config();

createApp({ port });
