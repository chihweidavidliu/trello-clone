"use client";
import { useState } from "react";
import { shiftInArray, insertAtIndex } from "shared-utils";
import ColumnComponent from "@/components/Column";
import { BoardDTO, ColumnDTO, TicketDTO } from "shared-utils";

export interface BoardPageClientProps {
  board: BoardDTO;
}

export default function BoardPageClient({ board }: BoardPageClientProps) {
  const [columns, setColumns] = useState<ColumnDTO[]>(board?.columns || []);

  const ticketsById = columns.reduce((acc, col) => {
    col?.tickets?.forEach((ticket) => {
      acc[ticket.id] = ticket;
    });

    return acc;
  }, {} as Record<string, TicketDTO>);

  const handleTicketDrop = async (
    ticketId: string,
    indexInNewCol: number,
    newColId: string
  ) => {
    console.log("handling ticket drop", {
      ticketId,
      newColId,
      indexInNewCol,
    });
    const ticket = ticketsById[ticketId];

    const updatedCols = columns.map((column) => {
      const tickets = column?.tickets || [];

      // if the ticket has moved within the same column
      if (ticket.columnId === newColId && column.id === ticket.columnId) {
        console.log("source col === target col", column);

        // TODO: update
        // this is the source col
        return {
          ...column,
          tickets: shiftInArray(tickets, ticket.index, indexInNewCol).map(
            (t, index) => ({
              ...t,
              index,
            })
          ),
        };

        // update the source column indices
      } else if (ticket.columnId === column.id) {
        console.log("source col", column);
        // this is the source col
        return {
          ...column,
          tickets: tickets
            .filter((t) => t.id !== ticket.id)
            .map((t, index) => ({ ...t, index })),
        };

        // update the target col indices
      } else if (newColId === column.id) {
        console.log("target col", column);
        // this is the target col

        return {
          ...column,
          tickets: insertAtIndex<TicketDTO>(
            { ...ticket, columnId: newColId },
            tickets,
            indexInNewCol
          ).map((t, index) => ({ ...t, index })),
        };
      }

      return column;
    });

    setColumns(updatedCols);

    console.log("updatedCols", updatedCols);
  };

  console.log("columns", columns);

  return (
    <div className="flex gap-1">
      {columns.map((col) => {
        return (
          <ColumnComponent
            key={col.id}
            column={col}
            handleTicketDrop={(ticketId, indexInNewCol) =>
              handleTicketDrop(ticketId, indexInNewCol, col.id)
            }
          />
        );
      })}
    </div>
  );
}
