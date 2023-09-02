import { z } from "zod";

export const MoveTicketParamSchema = z.object({
  ticketId: z.string().uuid(),
});

export const MoveTicketBodySchema = z.object({
  newColId: z.string().uuid(),
  newIndex: z.number().int(),
});

export type MoveTicketPayload = z.infer<typeof MoveTicketBodySchema>;
