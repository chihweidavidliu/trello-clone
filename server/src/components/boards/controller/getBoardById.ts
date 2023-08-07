import { Board } from "@prisma/client";
import { BoardsControllerProps } from ".";

export type GetBoardById = (id: string) => Promise<Board | null>;

export const createGetBoardsById =
  ({ boardsRepository }: BoardsControllerProps): GetBoardById =>
  (id: string) => {
    return boardsRepository.getById(id);
  };
