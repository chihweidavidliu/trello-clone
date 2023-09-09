import { ColumnDTO, TicketDTO } from "shared-utils";
import {
  BoardColumn,
  BoardColumnId,
  BoardId,
} from "../../../db/generated-types";
import { ColumnAggregate } from "./column.aggregate";
import { Mapper } from "../../../types/domain/Mapper";

export interface ColumnMapper
  extends Mapper<ColumnAggregate, BoardColumn, ColumnDTO> {
  toDomain(rawColumn: BoardColumn, tickets: TicketDTO[]): ColumnAggregate;
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
    return column.props;
  },
  toDomain(rawColumn: BoardColumn, tickets: TicketDTO[]): ColumnAggregate {
    const column: ColumnDTO = {
      ...rawColumn,
      tickets,
    };

    return ColumnAggregate.create(column);
  },
};

Object.freeze(columnMapper);
