import { insertAtIndex, shiftInArray } from "shared-utils";
import { BadRequestError } from "../../../errors/bad-request-error";
import { AggregateRoot } from "../../../types/domain/AggregateRoot";
import { TicketEntity } from "./ticket.entity";

export interface ColumnAggregateProps {
  id: string;
  title: string;
  index: number;
  createdAt: Date;
  updatedAt: Date;
  boardId: string;
  tickets?: TicketEntity[];
}

export class ColumnAggregate extends AggregateRoot<ColumnAggregateProps> {
  private constructor(props: ColumnAggregateProps) {
    super(props);
  }

  public static create(props: ColumnAggregateProps) {
    return new ColumnAggregate(props);
  }

  get id() {
    return this._id;
  }

  get tickets(): TicketEntity[] {
    return this.props.tickets || [];
  }

  removeTicket(ticketId: string): TicketEntity {
    const ticket = this.tickets.find(
      (ticket) => ticket.id.toString() === ticketId
    );
    if (!ticket) {
      throw new BadRequestError(
        `Failed to remove ticket ${ticketId} from column ${this.id}`
      );
    }

    const updatedTickets: TicketEntity[] = this.tickets
      .filter((t) => !t.id.equals(ticket.id))
      .map((t, index) => t.updateIndex(index));

    this.props.tickets = updatedTickets;
    return ticket;
  }

  addTicket(ticket: TicketEntity, newIndex: number) {
    ticket.updateColumnId(this.props.id);

    const updatedTickets: TicketEntity[] = insertAtIndex<TicketEntity>(
      ticket,
      this.tickets,
      newIndex
    ).map((t, index) => t.updateIndex(index));

    this.props.tickets = updatedTickets;
  }

  reorderTicket(ticketId: string, newIndex: number) {
    const ticket = this.tickets.find(
      (ticket) => ticket.id.toString() === ticketId
    );
    if (!ticket) {
      throw new BadRequestError(
        `Ticket ${ticketId} not found in column ${this.id}`
      );
    }

    const updatedTickets = shiftInArray(
      this.tickets,
      ticket.props.index,
      newIndex
    ).map((t, index) => t.updateIndex(index));

    this.props.tickets = updatedTickets;
  }
}
