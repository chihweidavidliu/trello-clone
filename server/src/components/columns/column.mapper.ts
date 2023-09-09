import { ColumnDTO, TicketDTO } from "shared-utils";
import { BoardColumn, BoardColumnId, BoardId } from "../../db/generated-types";

import { Mapper } from "../../types/domain/Mapper";
import {
  ColumnAggregate,
  ColumnAggregateProps,
} from "./domain/column.aggregate";
import { ticketMapper } from "./domain/ticket.mapper";
import { TicketEntity } from "./domain/ticket.entity";

export interface ColumnMapper
  extends Mapper<ColumnAggregate, BoardColumn, ColumnDTO> {
  toDomain(rawColumn: BoardColumn, tickets: TicketEntity[]): ColumnAggregate;
}

export const columnMapper: ColumnMapper = {
  toPersistence(column: ColumnAggregate) {
    const { id, tickets, boardId, ...primitive } = column.props;
    return {
      id: id as BoardColumnId,
      ...primitive,
      boardId: boardId as BoardId,
    };
  },
  toDTO(column: ColumnAggregate): ColumnDTO {
    return {
      ...column.props,
      tickets: column.props.tickets.map((t) => ticketMapper.toDTO(t)),
    };
  },
  toDomain(rawColumn: BoardColumn, tickets: TicketEntity[]): ColumnAggregate {
    const column: ColumnAggregateProps = {
      ...rawColumn,
      tickets,
    };

    return ColumnAggregate.create(column);
  },
};

Object.freeze(columnMapper);
