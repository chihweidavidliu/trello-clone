// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { TicketId } from './Ticket';

/** Identifier type for public.ticket_assigned_to_user */
export type TicketAssignedToUserId = string & { __brand: 'TicketAssignedToUserId' };

/** Represents the table public.ticket_assigned_to_user */
export default interface TicketAssignedToUser {
  id: TicketAssignedToUserId;

  userId: string;

  ticketId: TicketId;

  createdAt: Date;

  updatedAt: Date;
}

/** Represents the initializer for the table public.ticket_assigned_to_user */
export interface TicketAssignedToUserInitializer {
  /** Default value: uuid_generate_v4() */
  id?: TicketAssignedToUserId;

  userId: string;

  ticketId: TicketId;

  /** Default value: CURRENT_TIMESTAMP */
  createdAt?: Date;

  /** Default value: CURRENT_TIMESTAMP */
  updatedAt?: Date;
}

/** Represents the mutator for the table public.ticket_assigned_to_user */
export interface TicketAssignedToUserMutator {
  id?: TicketAssignedToUserId;

  userId?: string;

  ticketId?: TicketId;

  createdAt?: Date;

  updatedAt?: Date;
}
