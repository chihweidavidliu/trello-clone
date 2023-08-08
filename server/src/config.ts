export interface Config {
  port: number;
  databaseUrl: string | undefined;
}

export const config = (): Config => {
  return {
    databaseUrl: process.env.DATABASE_URL,
    port: Number(process.env.PORT),
  };
};
