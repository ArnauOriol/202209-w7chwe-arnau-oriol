import type { NextFunction, Request, Response } from "express";
import type CustomError from "../../CustomError/CustomError";
import debugCreator from "debug";

const debug = debugCreator("fakebook:server:middlewares:errors");

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ message: "Endpoint not found" });
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  const { message, statusCode, publicMessage } = error;

  debug(message);

  const newStatusCode = statusCode ?? 500;
  const newMessage = publicMessage || "Something went wrong";

  res.status(newStatusCode).json({ error: newMessage });
};
