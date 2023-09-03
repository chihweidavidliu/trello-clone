import { TicketDTO } from "shared-utils";
import { TicketsControllerProps } from ".";

export type MoveTicket = (
  id: string,
  newColId: string,
  indexInCol: number
) => Promise<void>;

export const createMoveTicket = ({
  columnsRepository,
}: TicketsControllerProps): MoveTicket => {
  return async (id, newColId, indexInCol) => {
    // TODO: FILL THIS OUT
  };
};
