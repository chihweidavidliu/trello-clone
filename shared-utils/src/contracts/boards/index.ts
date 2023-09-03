import { z } from "zod";

export * from "./createBoard";
export * from "./getBoardById";

export const TicketAssignedToUserSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  ticketId: z.string().uuid(),
});

export const TicketSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  columnId: z.string().uuid(),
  createdByUserId: z.string(),
  assignedToUsers: z.array(TicketAssignedToUserSchema),
  index: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TicketDTO = z.infer<typeof TicketSchema>;

export const ColumnSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  boardId: z.string().uuid(),
  index: z.number().int(),
  tickets: z.array(TicketSchema).optional(),
  createdAt: z.date(),
});

export type ColumnDTO = z.infer<typeof ColumnSchema>;

export const BoardSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  createdByUserId: z.string(),
  createdAt: z.date(),
  columns: z.array(ColumnSchema).optional(),
});

export type BoardDTO = z.infer<typeof BoardSchema>;
