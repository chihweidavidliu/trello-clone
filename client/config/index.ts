export interface AppConfig {
  api: {
    boardServiceBaseUrl: string;
  };
}

export const config = (): AppConfig => ({
  api: {
    boardServiceBaseUrl: process.env.NEXT_PUBLIC_BOARD_SERVICE_BASE_URL || "",
  },
});
