import { z } from "zod";
import { ApiResponse } from "../response";
import { TicketDTO } from "../boards";

export const MoveTicketParamSchema = z.object({
  ticketId: z.string().uuid(),
});

export const MoveTicketBodySchema = z.object({
  sourceColId: z.string().uuid(),
  newColId: z.string().uuid(),
  newIndex: z.number().int(),
});

export type MoveTicketPayload = z.infer<typeof MoveTicketBodySchema>;

export type MoveTicketResponse = ApiResponse<{
  success: boolean;
  updatedTickets: TicketDTO[];
}>;
