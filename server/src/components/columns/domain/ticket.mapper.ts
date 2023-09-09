import { TicketDTO } from "shared-utils";
import {
  BoardColumnId,
  Ticket,
  TicketAssignedToUser,
  TicketId,
} from "../../../db/generated-types";
import { TicketEntity } from "./ticket.entity";
import { Mapper } from "../../../types/domain/Mapper";

export interface TicketMapper extends Mapper<TicketEntity, Ticket, TicketDTO> {
  toDomain(
    rawTicket: Ticket,
    assignedToUsers: TicketAssignedToUser[]
  ): TicketEntity;
}

export const ticketMapper: TicketMapper = {
  toPersistence(ticket: TicketEntity): Ticket {
    const props = ticket.props;
    return {
      ...props,
      id: props.id as TicketId,
      columnId: props.columnId as BoardColumnId,
    };
  },
  toDTO(ticket: TicketEntity): TicketDTO {
    return ticket.props;
  },
  toDomain(
    rawTicket: Ticket,
    assignedToUsers: TicketAssignedToUser[]
  ): TicketEntity {
    return TicketEntity.create({ ...rawTicket, assignedToUsers });
  },
};
