import express from "express";
import cors from "cors";
require("express-async-errors");
import { createBoardsRouter } from "./components/boards/boards.routes";
import { createBoardsController } from "./components/boards/controller";
import { BoardsQueries } from "./components/boards/queries";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import { Knex } from "knex";
import { createColumnsRouter } from "./components/columns/columns.routes";
import { createColumnsController } from "./components/columns/controller";
import { ColumnsRepository } from "./components/columns/domain/columns.repository";

export interface AppProps {
  port: number;
  dbContext: Knex;
}

export const createApp = ({ port, dbContext }: AppProps) => {
  // TODO: logging
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.get("/healthcheck", async (req, res) => {
    res.status(200).send("Ok");
  });

  const boardsRepository = new BoardsQueries({
    dbContext,
  });

  const boardsController = createBoardsController({
    boardsRepository,
  });

  const boardsRouter = createBoardsRouter({
    boardsController,
  });

  app.use(boardsRouter);

  const columnsRepository = new ColumnsRepository({ dbContext });

  const columnsController = createColumnsController({
    columnsRepository,
  });

  const columnsRouter = createColumnsRouter({
    columnsController: columnsController,
  });

  app.use(columnsRouter);

  app.all("*", () => {
    throw new NotFoundError();
  });

  app.use(errorHandler);
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });

  return { app, server };
};
