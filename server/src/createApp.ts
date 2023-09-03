import express from "express";
require("express-async-errors");
import { createBoardsRouter } from "./components/boards/boards.routes";
import { createBoardsController } from "./components/boards/controller";
import { BoardsRepository } from "./components/boards/repository";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import { Knex } from "knex";

export interface AppProps {
  port: number;
  dbContext: Knex;
}

export const createApp = ({ port, dbContext }: AppProps) => {
  // TODO: logging
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded());

  // TODO: cors

  app.get("/healthcheck", async (req, res) => {
    res.status(200).send("Ok");
  });

  const boardsRepository = new BoardsRepository({
    dbContext,
  });

  const boardsController = createBoardsController({
    boardsRepository,
  });

  const boardsRouter = createBoardsRouter({
    boardsController,
  });

  app.use(boardsRouter);

  app.all("*", () => {
    throw new NotFoundError();
  });

  app.use(errorHandler);
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });

  return { app, server };
};
