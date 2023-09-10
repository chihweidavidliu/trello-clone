import { ColumnsRepository } from "../domain/columns.repository";
import { MoveTicket, createMoveTicket } from "./moveTicket";

export interface ColumnsControllerProps {
  columnsRepository: ColumnsRepository;
}

export interface ColumnsController {
  moveTicket: MoveTicket;
}

export const createColumnsController = (
  props: ColumnsControllerProps
): ColumnsController => {
  return {
    moveTicket: createMoveTicket(props),
  };
};
