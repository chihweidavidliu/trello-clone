import { Board, PrismaClient } from "@prisma/client";

export interface BoardIncludeOptions {
  columns: boolean;
  tickets: boolean;
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

  parseIncludeOptions(includeOptions?: BoardIncludeOptions) {
    return {
      columns: includeOptions?.columns
        ? {
            include: includeOptions.tickets
              ? {
                  tickets: {
                    include: {
                      assignedToUsers: true,
                    },
                  },
                }
              : undefined,
          }
        : undefined,
    };
  }

  async getById(
    id: string,
    options?: {
      include?: BoardIncludeOptions;
    }
  ): Promise<Board | null> {
    const board = await this.dbContext.board.findUnique({
      where: {
        id,
      },
      include: this.parseIncludeOptions(options?.include),
    });

    return board;
  }
}
