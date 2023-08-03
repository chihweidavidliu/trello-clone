"use-client";

import { Ticket } from "@/app/mock-data";

export interface TicketProps {
  ticket: Ticket;
  columnId: string;
}

const TicketCard = ({ ticket, columnId }: TicketProps) => {
  return (
    <div
      data-column-id={columnId}
      className="mt-3 border-1 border-gray-600 rounded-sm bg-white shadow-md cursor-pointer p-3 min-h-[5rem]"
      draggable
      id={ticket.id}
    >
      <h3 className="my-1 text-md select-none">{ticket.title}</h3>
      {ticket.assignedTo && (
        <p className="my-1 text-sm select-none">
          Assigned to: {ticket.assignedTo.fullname}
        </p>
      )}
    </div>
  );
};

export default TicketCard;
