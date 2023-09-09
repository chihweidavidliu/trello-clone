import {
  ColumnDTO,
  TicketDTO,
  insertAtIndex,
  shiftInArray,
} from "shared-utils";
import { BoardColumnId, Ticket, TicketId } from "../../../db/generated-types";
import { BadRequestError } from "../../../errors/bad-request-error";
import { AggregateRoot } from "../../../types/domain/AggregateRoot";

export class ColumnAggregate extends AggregateRoot<ColumnDTO> {
  private constructor(props: ColumnDTO) {
    super(props);
  }

  public static create(props: ColumnDTO) {
    return new ColumnAggregate(props);
  }

  ticketsToPrimitive(): Ticket[] {
    return this.tickets.map(({ id, columnId, ...ticket }) => {
      return {
        id: id as TicketId,
        columnId: columnId as BoardColumnId,
        ...ticket,
      };
    });
  }

  get id() {
    return this._id;
  }

  get tickets(): TicketDTO[] {
    return this.props.tickets;
  }

  removeTicket(ticketId: string): TicketDTO {
    const ticket = this.tickets.find((ticket) => ticket.id === ticketId);
    if (!ticket) {
      throw new BadRequestError(
        `Failed to remove ticket ${ticketId} from column ${this.id}`
      );
    }

    const updatedTickets = this.tickets
      .filter((t) => t.id !== ticket.id)
      .map((t, index) => ({ ...t, index }));

    this.props.tickets = updatedTickets;
    return ticket;
  }

  addTicket(ticket: Omit<TicketDTO, "index" | "columnId">, index: number) {
    const updatedTickets = insertAtIndex<TicketDTO>(
      { ...ticket, index, columnId: this.id.toString() },
      this.tickets,
      index
    ).map((t, index) => ({ ...t, index }));

    this.props.tickets = updatedTickets;
  }

  reorderTicket(ticketId: string, newIndex: number) {
    const ticket = this.tickets.find((ticket) => ticket.id === ticketId);
    if (!ticket) {
      throw new BadRequestError(
        `Ticket ${ticketId} not found in column ${this.id}`
      );
    }

    const updatedTickets = shiftInArray(
      this.tickets,
      ticket.index,
      newIndex
    ).map((t, index) => ({ ...t, index }));

    this.props.tickets = updatedTickets;
  }
}
