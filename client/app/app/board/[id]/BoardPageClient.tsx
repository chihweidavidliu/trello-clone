"use client";
import { useRef, useState } from "react";

import { insertAtIndex } from "@/helpers/insertAtIndex";
import { shiftInArray } from "@/helpers/shiftInArray";
import ColumnComponent from "@/components/Column";
import { Board, Column, Ticket } from "shared-utils";

export interface BoardPageClientProps {
  board: Board;
}

export default function BoardPageClient({ board }: BoardPageClientProps) {
  const [columns, setColumns] = useState<Column[]>(board?.columns || []);

  const ticketsById = columns.reduce((acc, col) => {
    col?.tickets?.forEach((ticket) => {
      acc[ticket.id] = ticket;
    });

    return acc;
  }, {} as Record<string, Ticket>);

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

    const updatedCols = columns.map((column) => {
      const ticket = ticketsById[ticketId];

      const tickets = column?.tickets || [];
      if (ticket.columnId === newColId && column.id === ticket.columnId) {
        console.log("source col === target col", column);
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
      } else if (ticket.columnId === column.id) {
        console.log("source col", column);
        // this is the source col
        return {
          ...column,
          tickets: tickets
            .filter((t) => t.id !== ticket.id)
            .map((t, index) => ({ ...t, index })),
        };
      } else if (newColId === column.id) {
        console.log("target col", column);
        // this is the target col

        return {
          ...column,
          tickets: insertAtIndex<Ticket>(
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
