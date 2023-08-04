export interface Config {
  port: number;
}

export const config = (): Config => {
  return {
    port: Number(process.env.PORT),
  };
};
