export interface ApiError {
  message: string;
  path?: (string | number)[];
}

export interface ApiResponse<T> {
  errors: ApiError[] | null;
  data: T;
}
