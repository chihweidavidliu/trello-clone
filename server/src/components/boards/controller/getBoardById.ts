import { Board } from "@prisma/client";
import { BoardsControllerProps } from ".";
import { BoardIncludeOptions } from "../repository";

export type GetBoardById = (
  id: string,
  options?: { include?: BoardIncludeOptions }
) => Promise<Board | null>;

export const createGetBoardsById =
  ({ boardsRepository }: BoardsControllerProps): GetBoardById =>
  (id: string, options) => {
    return boardsRepository.getById(id, options);
  };
