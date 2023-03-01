// api404Error.ts
import httpStatusCodes from "./httpStatusCodes";
import BaseError from "./baseError";
export default class Api404Error extends BaseError {
  constructor(
    message: string,
    statusCode: number = httpStatusCodes.NOT_FOUND,
    isOperational = true
  ) {
    super(message, statusCode, isOperational);
  }
}
