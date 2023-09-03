"use-client";
import TicketCard from "./Ticket";
import Dropzone from "./Dropzone";
import { ColumnDTO } from "shared-utils";

export interface ColumnProps {
  column: ColumnDTO;
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
      className="width-[18rem] min-w-[18rem] max-w-[18rem] py-4 px-3 rounded-md border-2 border-slate-300 bg-slate-100 shadow-lg"
      id={id}
    >
      <h2 className="text-lg text-blue-950 font-semibold">{title}</h2>
      <div className="h-full" id={id + "-ticket-list"}>
        {tickets && tickets.length > 0 ? (
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
            isVisible
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
