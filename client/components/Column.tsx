"use-client";
import TicketCard from "./Ticket";
import Dropzone from "./Dropzone";
import { Ticket } from "@/app/mock-data";

export interface Column {
  id: string;
  title: string;
  tickets: Ticket[];
}

export interface ColumnProps {
  column: Column;
  handleTicketDrop: (
    draggedTicketId: string,
    orderInNewColumn: number
  ) => Promise<void>;
}

const ColumnComponent = ({
  column: { id, title, tickets },
  handleTicketDrop,
}: ColumnProps) => {
  const handleDrop = async (ticketId: string, newIndex: number) => {
    if (ticketId.includes("placeholder")) {
    }

    // get ticket data
    return handleTicketDrop(ticketId, newIndex);
  };

  return (
    <div
      className="width-[15rem] min-w-[15rem] border-2 py-4 px-2 rounded-md bg-gray-200"
      id={id}
    >
      <h2 className="text-lg">{title}</h2>
      <div className="h-full" id={id + "-ticket-list"}>
        {tickets.length > 0 ? (
          tickets
            .sort((a, b) => a.index - b.index)
            .map((ticket, index) => {
              return (
                <Dropzone
                  id={ticket.id}
                  key={ticket.id}
                  handleDrop={(ticketId: string, insertBefore) => {
                    const ticketIndex = tickets.findIndex(
                      (t) => t.id === ticketId
                    );
                    const isPrecedingTicket =
                      ticketIndex !== -1 && ticketIndex < index;

                    const newIndex =
                      insertBefore || isPrecedingTicket ? index : index + 1;

                    return handleDrop(ticketId, newIndex);
                  }}
                >
                  <TicketCard ticket={ticket} columnId={id} />
                </Dropzone>
              );
            })
        ) : (
          <Dropzone
            id={id + "-placeholder-dropzone"}
            handleDrop={(ticketId: string, insertBefore) => {
              const newIndex = 0;

              return handleDrop(ticketId, newIndex);
            }}
          ></Dropzone>
        )}
      </div>
    </div>
  );
};

export default ColumnComponent;
