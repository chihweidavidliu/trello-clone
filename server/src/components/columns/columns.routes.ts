import express from "express";
import {
  ApiResponse,
  CreateBoardSchema,
  GetBoardByIdParamSchema,
  MoveTicketBodySchema,
  MoveTicketParamSchema,
  MoveTicketPayload,
} from "shared-utils";
import { BadRequestError } from "../../errors/bad-request-error";
import { validateRequest } from "../../middlewares/validate-request";
import { ColumnsController } from "./controller";

export interface TicketsRouterProps {
  ticketsController: ColumnsController;
}

export const createBoardsRouter = ({
  ticketsController,
}: TicketsRouterProps) => {
  const router = express.Router();

  router.patch(
    "/ticket/:ticketId/move",
    validateRequest({
      params: MoveTicketParamSchema,
      body: MoveTicketBodySchema,
    }),
    async (req, res) => {
      const ticketId: string = req.params.ticketId;
      const body: MoveTicketPayload = req.body;

      await ticketsController.moveTicket(
        ticketId,
        body.newColId,
        body.newIndex
      );

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
