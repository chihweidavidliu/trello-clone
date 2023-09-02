import { Ticket } from "shared-utils";
import { TicketsControllerProps } from ".";

export type MoveTicket = (
  id: string,
  newColId: string,
  indexInCol: number
) => Promise<void>;

export const createMoveTicket = ({
  ticketsRepository,
}: TicketsControllerProps): MoveTicket => {
  return async (id, newColId, indexInCol) => {
    // TODO: FILL THIS OUT
  };
};
