import { TicketDTO } from "shared-utils";
import { TicketsControllerProps } from ".";
import { BadRequestError } from "../../../errors/bad-request-error";

export type MoveTicket = (
  ticketId: string,
  oldColId: string,
  newColId: string,
  indexInCol: number
) => Promise<TicketDTO[]>;

export const createMoveTicket = ({
  columnsRepository,
}: TicketsControllerProps): MoveTicket => {
  return async (ticketId, oldColId, newColId, indexInCol) => {
    // TODO: check user has permission to edit the board (method on the column entity)

    const colsToLoad: string[] = [oldColId];
    if (newColId !== oldColId) {
      colsToLoad.push(newColId);
    }

    const cols = await columnsRepository.getColumnsById(colsToLoad);

    // moving ticket within same column
    if (cols.length === 1) {
      const column = cols[0];
      column.reorderTicket(ticketId, indexInCol);
      await columnsRepository.save(column);
      return column.tickets;
    } else {
      const sourceCol = cols[0];
      const targetCol = cols[0];

      const removedTicket = sourceCol.removeTicket(ticketId);
      targetCol.addTicket(removedTicket, indexInCol);

      await columnsRepository.save([sourceCol, targetCol]);

      return [sourceCol, targetCol].reduce((acc, c) => {
        acc = { ...acc, ...c.tickets };
        return acc;
      }, [] as TicketDTO[]);
    }
  };
};
