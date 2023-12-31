import { ZodError } from "zod";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ZodError["issues"]) {
    // CustomError (like Error) expects a default message property to be passed when instantiated
    // RequestValidationError will just pass a default message for logging purposes, but for API responses will
    // rely on the array of type ValidationError[] from express-validator that we pass in when instantiating the RequestValidationError
    super("Invalid request parameters");

    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  toApiErrors() {
    const formattedErrors = this.errors.map((issue) => {
      return {
        message: `Validation failed: ${issue.message}`,
        path: issue.path,
      };
    });

    return formattedErrors;
  }
}
