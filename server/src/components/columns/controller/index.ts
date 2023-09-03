import { ColumnsRepository } from "../repository";
import { MoveTicket, createMoveTicket } from "./moveTicket";

export interface TicketsControllerProps {
  columnsRepository: ColumnsRepository;
}

export interface ColumnsController {
  moveTicket: MoveTicket;
}

export const createColumnsController = (
  props: TicketsControllerProps
): ColumnsController => {
  return {
    moveTicket: createMoveTicket(props),
  };
};
