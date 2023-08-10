import { z } from "zod";

export const CreateTicketSchema = z.object({
  title: z.string(),
  description: z.string(),
  columnId: z.string().uuid(),
  index: z.number().int(),
});

export type CreateTicketPayload = z.infer<typeof CreateTicketSchema>;

export const CreateColumnSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  boardId: z.string().uuid(),
  index: z.number().int(),
  tickets: z.array(CreateTicketSchema).optional(),
  createdAt: z.date(),
});

export type CreateColumnPayload = z.infer<typeof CreateColumnSchema>;

export const CreateBoardSchema = z.object({
  title: z.string(),
  createdByUserId: z.string(),
  columns: z.array(CreateColumnSchema).optional(),
});

export type CreateBoardPayload = z.infer<typeof CreateBoardSchema>;
