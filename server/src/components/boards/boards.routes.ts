import express from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { BoardsController } from "./controller";

export interface BoardRouterProps {
  boardsController: BoardsController;
}

export const createBoardsRouter = ({ boardsController }: BoardRouterProps) => {
  const router = express.Router();

  router.get("/boards/:id", async (req, res) => {
    const id = req.params.id;

    const board = await boardsController.getBoardById(id);
    if (!board) throw new BadRequestError(`Could not find board with id ${id}`);

    res.status(200).json({
      errors: null,
      data: {
        board,
      },
    });
  });

  return router;
};
