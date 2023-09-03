import express from "express";
import {
  ApiResponse,
  BoardDTO,
  CreateBoardSchema,
  GetBoardByIdParamSchema,
} from "shared-utils";
import { BadRequestError } from "../../errors/bad-request-error";
import { validateRequest } from "../../middlewares/validate-request";
import { BoardsController } from "./controller";

export interface BoardRouterProps {
  boardsController: BoardsController;
}

export const createBoardsRouter = ({ boardsController }: BoardRouterProps) => {
  const router = express.Router();

  router.get(
    "/boards/:id",
    validateRequest({ params: GetBoardByIdParamSchema }),
    async (req, res) => {
      const id = req.params.id;
      const includeRaw = req.query.include as string;
      const include = includeRaw ? new Set(includeRaw.split(",")) : new Set();

      const board = await boardsController.getBoardById(id, {
        include: {
          columns: include.has("columns"),
          tickets: include.has("columns") && include.has("tickets"),
        },
      });
      if (!board)
        throw new BadRequestError(`Could not find board with id ${id}`);

      const response: ApiResponse<{ board: BoardDTO }> = {
        errors: null,
        data: {
          board,
        },
      };

      res.status(200).send(response);
    }
  );

  router.post(
    "/boards",
    validateRequest({ body: CreateBoardSchema }),
    async (req, res) => {
      // TODO: add controller

      res.status(200).send({
        errors: null,
        data: {
          success: true,
        },
      });
    }
  );

  return router;
};
