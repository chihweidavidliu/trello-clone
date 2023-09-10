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

    const result: Ticket = {
      id: props.id as TicketId,
      title: props.title,
      description: props.description,
      index: props.index,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      createdByUserId: props.createdByUserId,
      columnId: props.columnId as BoardColumnId,
    };

    return result;
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
