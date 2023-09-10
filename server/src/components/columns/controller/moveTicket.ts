import { TicketDTO } from "shared-utils";
import { ColumnsControllerProps } from ".";
import { ticketMapper } from "../domain/ticket.mapper";
import { InternalServerError } from "../../../errors/internal-server-error";

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

    // moving ticket within same column
    if (sourceColId === newColId) {
      const [column] = await columnsRepository.getColumnsById([sourceColId]);

      if (!column) {
        throw new InternalServerError(
          `Could not find column with id ${sourceColId}`
        );
      }

      column.reorderTicket(ticketId, indexInCol);
      await columnsRepository.save(column);
      return column.tickets.map((t) => ticketMapper.toDTO(t));
    } else {
      const columns = await columnsRepository.getColumnsById([
        sourceColId,
        newColId,
      ]);

      const sourceCol = columns.find(
        (col) => col.id.toString() === sourceColId
      );

      const targetCol = columns.find((col) => col.id.toString() === newColId);

      if (!sourceCol || !targetCol) {
        throw new InternalServerError(`Could not find source or target col`);
      }

      console.log(
        `Moving ticket from ${sourceCol.props.title} to ${targetCol.props.title}`
      );

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
