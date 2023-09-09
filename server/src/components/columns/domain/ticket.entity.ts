import { TicketDTO } from "shared-utils";
import { Entity } from "../../../types/domain/Entity";

export class TicketEntity extends Entity<TicketDTO> {
  private constructor(props: TicketDTO) {
    super(props);
  }

  public static create(props: TicketDTO) {
    return new TicketEntity(props);
  }

  get id() {
    return this._id;
  }
}
