import express from "express";
require("express-async-errors");
import { createBoardsRouter } from "./components/boards/boards.routes";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";

export interface AppProps {
  port: number;
}

export const createApp = ({ port }: AppProps) => {
  // TODO: logging
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded());

  // TODO: cors

  app.get("/healthcheck", async (req, res) => {
    res.status(200).send("Ok");
  });

  const boardsRouter = createBoardsRouter({});
  app.use(boardsRouter);

  app.all("*", () => {
    throw new NotFoundError();
  });

  app.use(errorHandler);
  app.listen(port, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });

  return app;
};
