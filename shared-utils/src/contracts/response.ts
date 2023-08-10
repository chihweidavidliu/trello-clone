export interface ApiError {
  message: string;
  field?: string;
}

export interface ApiResponse<T> {
  errors: ApiError[] | null;
  data: T;
}
