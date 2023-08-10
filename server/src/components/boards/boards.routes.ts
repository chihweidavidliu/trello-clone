import express from "express";
import { ApiResponse, Board as BoardContract } from "shared-utils";

import { BadRequestError } from "../../errors/bad-request-error";
import { BoardsController } from "./controller";

export interface BoardRouterProps {
  boardsController: BoardsController;
}

export const createBoardsRouter = ({ boardsController }: BoardRouterProps) => {
  const router = express.Router();

  router.get("/boards/:id", async (req, res) => {
    const id = req.params.id;
    const includeRaw = req.query.include as string;
    const include = includeRaw ? new Set(includeRaw.split(",")) : new Set();

    const board = await boardsController.getBoardById(id, {
      include: {
        columns: include.has("columns"),
        tickets: include.has("columns") && include.has("tickets"),
      },
    });
    if (!board) throw new BadRequestError(`Could not find board with id ${id}`);

    const response: ApiResponse<{ board: BoardContract }> = {
      errors: null,
      data: {
        board,
      },
    };

    res.status(200).json(response);
  });

  return router;
};
