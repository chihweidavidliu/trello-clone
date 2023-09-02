import { TicketsRepository } from "../repository";
import { MoveTicket, createMoveTicket } from "./moveTicket";

export interface TicketsControllerProps {
  ticketsRepository: TicketsRepository;
}

export interface TicketsController {
  moveTicket: MoveTicket;
}

export const createTicketsController = (
  props: TicketsControllerProps
): TicketsController => {
  return {
    moveTicket: createMoveTicket(props),
  };
};
