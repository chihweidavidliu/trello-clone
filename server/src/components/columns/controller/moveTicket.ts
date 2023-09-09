import { TicketDTO } from "shared-utils";
import { ColumnsControllerProps } from ".";
import { ticketMapper } from "../domain/ticket.mapper";

export type MoveTicket = (
  ticketId: string,
  sourceColId: string,
  newColId: string,
  indexInCol: number
) => Promise<TicketDTO[]>;

export const createMoveTicket = ({
  columnsRepository,
}: ColumnsControllerProps): MoveTicket => {
  return async (ticketId, sourceColId, newColId, indexInCol) => {
    // TODO: check user has permission to edit the board (method on the column entity)

    const colsToLoad: string[] = [sourceColId];
    if (newColId !== sourceColId) {
      colsToLoad.push(newColId);
    }

    const cols = await columnsRepository.getColumnsById(colsToLoad);

    // moving ticket within same column
    if (cols.length === 1) {
      const column = cols[0];
      column.reorderTicket(ticketId, indexInCol);
      await columnsRepository.save(column);
      return column.tickets.map((t) => ticketMapper.toDTO(t));
    } else {
      const sourceCol = cols[0];
      const targetCol = cols[0];

      const removedTicket = sourceCol.removeTicket(ticketId);
      targetCol.addTicket(removedTicket, indexInCol);

      await columnsRepository.save([sourceCol, targetCol]);

      const result: TicketDTO[] = [sourceCol, targetCol].reduce<TicketDTO[]>(
        (acc, c) => {
          const ticketDTOs = c.tickets.map((t) => ticketMapper.toDTO(t));
          acc = [...acc, ...ticketDTOs];
          return acc;
        },
        []
      );

      return result;
    }
  };
};
