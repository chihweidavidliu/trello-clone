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
      className="mt-3 border-2 border-gray-100 hover:bg-gray-200 rounded-md bg-white shadow-sm cursor-pointer p-3 min-h-[5rem]"
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
