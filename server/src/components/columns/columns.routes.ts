import express from "express";
import {
  MoveTicketBodySchema,
  MoveTicketParamSchema,
  MoveTicketPayload,
  MoveTicketResponse,
} from "shared-utils";
import { validateRequest } from "../../middlewares/validate-request";
import { ColumnsController } from "./controller";

export interface TicketsRouterProps {
  columnsController: ColumnsController;
}

export const createColumnsRouter = ({
  columnsController: ticketsController,
}: TicketsRouterProps) => {
  const router = express.Router();

  router.patch(
    "/columns/move-ticket/:ticketId",
    validateRequest({
      params: MoveTicketParamSchema,
      body: MoveTicketBodySchema,
    }),
    async (req, res) => {
      const ticketId: string = req.params.ticketId;
      const body: MoveTicketPayload = req.body;

      const updatedTickets = await ticketsController.moveTicket(
        ticketId,
        body.sourceColId,
        body.newColId,
        body.newIndex
      );

      const response: MoveTicketResponse = {
        errors: null,
        data: {
          success: true,
          updatedTickets,
        },
      };

      res.status(200).send(response);
    }
  );

  return router;
};
