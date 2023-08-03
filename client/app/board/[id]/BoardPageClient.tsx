"use client";
import { Column, Ticket } from "@/app/mock-data";
import { useRef, useState } from "react";

import { insertAtIndex } from "@/helpers/insertAtIndex";
import { shiftInArray } from "@/helpers/shiftInArray";
import ColumnComponent from "@/components/Column";

export interface BoardPageClientProps {
  initialColumns: Column[];
}

export default function BoardPageClient({
  initialColumns,
}: BoardPageClientProps) {
  const [columns, setColumns] = useState(initialColumns);

  const ticketsById = columns.reduce((acc, col) => {
    col.tickets.forEach((ticket) => {
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

      if (ticket.columnId === newColId && column.id === ticket.columnId) {
        console.log("source col === target col", column);
        // this is the source col
        return {
          ...column,
          tickets: shiftInArray(
            column.tickets,
            ticket.index,
            indexInNewCol
          ).map((t, index) => ({
            ...t,
            index,
          })),
        };
      } else if (ticket.columnId === column.id) {
        console.log("source col", column);
        // this is the source col
        return {
          ...column,
          tickets: column.tickets
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
            column.tickets,
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
    <div>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>

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
    </div>
  );
}
