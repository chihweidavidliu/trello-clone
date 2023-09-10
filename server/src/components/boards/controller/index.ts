import { BoardsQueries } from "../queries";
import { createGetBoardsById, GetBoardById } from "./getBoardById";

export interface BoardsControllerProps {
  boardsRepository: BoardsQueries;
}

export interface BoardsController {
  getBoardById: GetBoardById;
}

export const createBoardsController = (
  props: BoardsControllerProps
): BoardsController => {
  return {
    getBoardById: createGetBoardsById(props),
  };
};
