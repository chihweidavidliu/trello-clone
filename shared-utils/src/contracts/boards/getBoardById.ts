import { z } from "zod";
import { ApiResponse } from "../response";
import { BoardDTO } from ".";

export const GetBoardByIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type GetBoardByIdResponse = ApiResponse<{ board: BoardDTO | null }>;
