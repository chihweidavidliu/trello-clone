import { TicketDTO, insertAtIndex, shiftInArray } from "shared-utils";
import { TicketsControllerProps } from ".";
import { BadRequestError } from "../../../errors/bad-request-error";
import { BoardColumnId, Ticket } from "../../../db/generated-types";

export type MoveTicket = (
  ticketId: string,
  newColId: string,
  indexInCol: number
) => Promise<Ticket[]>; // TODO: return TicketDTO instead

export const createMoveTicket = ({
  columnsRepository,
}: TicketsControllerProps): MoveTicket => {
  return async (ticketId, newColId, indexInCol) => {
    const ticket = await columnsRepository.getTicketById(ticketId);

    if (!ticket) {
      throw new BadRequestError("Ticket not found");
    }

    const colsToLoad: string[] = [ticket.columnId];
    if (newColId !== ticket.columnId) {
      colsToLoad.push(newColId);
    }

    const cols = await columnsRepository.getColumnsById(colsToLoad);

    // moving ticket within same column
    if (cols.length === 0) {
      const updatedTickets = shiftInArray(
        cols[0].tickets,
        ticket.index,
        indexInCol
      ).map((t, index) => ({ ...t, index }));

      const updatedTicketInserts = updatedTickets.map(
        ({ id, assignedToUsers, ...ticket }) => ({
          ...ticket,
          columnId: ticket.columnId as BoardColumnId,
        })
      );

      const results = await columnsRepository.updateTicketsOrder(
        updatedTicketInserts
      );

      return results;
    } else {
      const sourceCol = cols[0];
      const targetCol = cols[0];

      // update target col ticket indices
      const updatedTargetColTickets = insertAtIndex<TicketDTO>(
        { ...ticket, columnId: newColId },
        targetCol.tickets,
        indexInCol
      ).map((t, index) => ({ ...t, index }));

      const updatedTargetColTicketInserts = updatedTargetColTickets.map(
        ({ id, assignedToUsers, ...ticket }) => ({
          ...ticket,
          columnId: newColId as BoardColumnId,
        })
      );

      await columnsRepository.updateTicketsOrder(updatedTargetColTicketInserts);

      // update source col ticket indices

      const updatedSourceColTickets = sourceCol.tickets
        .filter((t) => t.id !== ticket.id)
        .map((t, index) => ({ ...t, index }));

      const updatedSoureColTicketInserts = updatedSourceColTickets.map(
        ({ id, assignedToUsers, ...ticket }) => ({
          ...ticket,
          columnId: ticket.columnId as BoardColumnId,
        })
      );

      const results = await columnsRepository.updateTicketsOrder([
        ...updatedTargetColTicketInserts,
        ...updatedSoureColTicketInserts,
      ]);

      return results;
    }
  };
};
