import {
  ColumnDTO,
  TicketDTO,
  insertAtIndex,
  shiftInArray,
} from "shared-utils";
import omit from "lodash/omit";
import { Entity } from "../../types/entity";
import {
  BoardColumn,
  BoardColumnId,
  BoardId,
  Ticket,
  TicketId,
} from "../../db/generated-types";

export class ColumnEntity extends Entity<ColumnDTO> {
  private constructor(props: ColumnDTO) {
    super(props);
  }

  public static create(props: ColumnDTO) {
    return new ColumnEntity(props);
  }

  toPrimitive(): BoardColumn {
    const { id, tickets, boardId, ...primitive } = this.props;
    return {
      id: id as BoardColumnId,
      ...primitive,
      boardId: boardId as BoardId,
    };
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

  removeTicket(ticketId: string): TicketDTO | null {
    const ticket = this.tickets.find((ticket) => ticket.id === ticketId);
    if (!ticket) return null;

    const updatedTickets = this.tickets
      .filter((t) => t.id !== ticket.id)
      .map((t, index) => ({ ...t, index }));

    this.props.tickets = updatedTickets;
    return ticket;
  }

  addTicket(ticket: Omit<TicketDTO, "index" | "columnId">, index: number) {
    const updatedTickets = insertAtIndex<TicketDTO>(
      { ...ticket, index, columnId: this.id },
      this.tickets,
      index
    ).map((t, index) => ({ ...t, index }));

    this.props.tickets = updatedTickets;
  }

  reorderTicket(ticketId: string, newIndex: number) {
    const ticket = this.tickets.find((ticket) => ticket.id === ticketId);
    if (!ticket) return;

    const updatedTickets = shiftInArray(
      this.tickets,
      ticket.index,
      newIndex
    ).map((t, index) => ({ ...t, index }));

    this.props.tickets = updatedTickets;
  }
}
