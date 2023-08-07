import express, { Router } from "express";

export interface BoardRouterProps {}

export const createBoardsRouter = ({}: BoardRouterProps) => {
  const router = express.Router();

  router.get("/boards", async (req, res) => {
    res.status(200).json({
      errors: null,
      data: {
        hello: false,
      },
    });
  });

  return router;
};
