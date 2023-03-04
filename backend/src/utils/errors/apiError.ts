// api404Error.ts
import httpStatusCodes from "../httpStatusCodes";
import BaseError from "./baseError";

// 404 error not found
export class Api404Error extends BaseError {
  constructor(
    message: string,
    statusCode: number = httpStatusCodes.NOT_FOUND,
    isOperational = true
  ) {
    super(message, statusCode, isOperational);
  }
}
// 400 error bad request
export class Api400Error extends BaseError {
  constructor(
    message: string,
    statusCode: number = httpStatusCodes.BAD_REQUEST,
    isOperational = true
  ) {
    super(message, statusCode, isOperational);
  }
}

// 409 error conflict
export class Api409Error extends BaseError {
  constructor(
    message: string,
    statusCode: number = httpStatusCodes.CONFLICT,
    isOperational = true
  ) {
    super(message, statusCode, isOperational);
  }
}

// 401 error unauthorized
export class Api401Error extends BaseError {
  constructor(
    message: string,
    statusCode: number = httpStatusCodes.UNAUTHORIZED,
    isOperational = true
  ) {
    super(message, statusCode, isOperational);
  }
}

// 403 error forbidden
export class Api403Error extends BaseError {
  constructor(
    message: string,
    statusCode: number = httpStatusCodes.FORBIDDEN,
    isOperational = true
  ) {
    super(message, statusCode, isOperational);
  }
}
