import express from "express";
require("express-async-errors");
import { boardsRouter } from "./components/boards/boards.routes";
import { config } from "./config";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";

const { port } = config();
// TODO: logging
// TODO: create app factory
const app = express();
app.use(express.json());
app.use(express.urlencoded());

// TODO: cors

app.get("/healthcheck", async (req, res) => {
  res.status(200).send("Ok");
});

app.use(boardsRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
