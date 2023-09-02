import { z } from "zod";

export const GetBoardByIdParamSchema = z.object({
  id: z.string().uuid(),
});
