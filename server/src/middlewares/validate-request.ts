import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { RequestValidationError } from "../errors/request-validation-error";

export interface ValidateRequestConfig<
  TParams = ZodSchema<any>,
  TQuery = ZodSchema<any>,
  TBody = ZodSchema<any>
> {
  body?: TBody;
  params?: TParams;
  query?: TQuery;
}

const validate = (schema: ZodSchema<any>, data: any) => {
  try {
    schema?.parse(data);
  } catch (error) {
    throw new RequestValidationError((error as ZodError).issues);
  }
};

export const validateRequest =
  ({ body, params, query }: ValidateRequestConfig) =>
  (req: Request, res: Response, next: NextFunction) => {
    body && validate(body, req.body);
    params && validate(params, req.params);
    query && validate(query, req.query);

    next();
  };
