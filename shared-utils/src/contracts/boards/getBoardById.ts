import { z } from "zod";
import { ApiResponse } from "../response";
import { Board } from ".";

export const GetBoardByIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type GetBoardByIdResponse = ApiResponse<{ board: Board | null }>;
