import { BoardsRepository } from "../repository";
import { createGetBoardsById, GetBoardById } from "./getBoardById";

export interface BoardsControllerProps {
  boardsRepository: BoardsRepository;
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
