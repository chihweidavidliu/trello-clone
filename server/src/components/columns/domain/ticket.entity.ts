import { Entity } from "../../../types/domain/Entity";

export interface TicketEntityProps {
  id: string;
  title: string;
  description: string | null;
  columnId: string;
  createdByUserId: string;
  assignedToUsers: {
    id: string;
    userId: string;
    ticketId: string;
  }[];
  index: number;
  createdAt: Date;
  updatedAt: Date;
}

export class TicketEntity extends Entity<TicketEntityProps> {
  private constructor(props: TicketEntityProps) {
    super(props);
  }

  public static create(props: TicketEntityProps) {
    return new TicketEntity(props);
  }

  get id() {
    return this._id;
  }

  get columnId() {
    return this.props.columnId;
  }

  updateIndex(newIndex: number): TicketEntity {
    this.props.index = newIndex;
    return this;
  }
  updateColumnId(columnId: string): TicketEntity {
    this.props.columnId = columnId;
    return this;
  }
}
