import { BoardDTO } from "shared-utils";
import { BoardsControllerProps } from ".";
import { BoardIncludeOptions } from "../queries";

export type GetBoardById = (
  id: string,
  options?: { include?: BoardIncludeOptions }
) => Promise<BoardDTO | null>;

export const createGetBoardsById =
  ({ boardsRepository }: BoardsControllerProps): GetBoardById =>
  (id: string, options) => {
    return boardsRepository.getById(id, options);
  };
