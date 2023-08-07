import { Board, PrismaClient } from "@prisma/client";

interface RepositoryProps {
  dbContext: PrismaClient;
}
export interface Repository {
  dbContext: PrismaClient;
}

export interface BoardsRepositoryProps {
  dbContext: PrismaClient;
}

export interface BoardsRepository {}

export class BoardsRepository {
  private dbContext: PrismaClient;

  constructor({ dbContext }: BoardsRepositoryProps) {
    this.dbContext = dbContext;
  }

  async getById(id: string): Promise<Board | null> {
    const board = await this.dbContext.board.findUnique({
      where: {
        id,
      },
      include: {
        columns: true,
      },
    });

    return board;
  }
}
