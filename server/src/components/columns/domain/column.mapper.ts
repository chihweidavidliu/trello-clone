import { ColumnDTO } from "shared-utils";
import {
  BoardColumn,
  BoardColumnId,
  BoardId,
} from "../../../db/generated-types";
import { ColumnAggregate, ColumnAggregateProps } from "./column.aggregate";
import { Mapper } from "../../../types/domain/Mapper";
import { ticketMapper } from "./ticket.mapper";
import { TicketEntity } from "./ticket.entity";

export interface ColumnMapper
  extends Mapper<ColumnAggregate, BoardColumn, ColumnDTO> {
  toDomain(rawColumn: BoardColumn, tickets: TicketEntity[]): ColumnAggregate;
}

export const columnMapper: ColumnMapper = {
  toPersistence(column: ColumnAggregate) {
    const { id, tickets, boardId, ...primitive } = column.props;

    const persistenceObject = {
      id: id as BoardColumnId,
      ...primitive,
      boardId: boardId as BoardId,
    };

    return persistenceObject;
  },
  toDTO(column: ColumnAggregate): ColumnDTO {
    return {
      ...column.props,
      tickets: column.tickets.map((t) => ticketMapper.toDTO(t)),
    };
  },
  toDomain(rawColumn: BoardColumn, tickets: TicketEntity[]): ColumnAggregate {
    const props: ColumnAggregateProps = {
      ...rawColumn,
      tickets: tickets || [],
    };

    return ColumnAggregate.create(props);
  },
};

Object.freeze(columnMapper);
