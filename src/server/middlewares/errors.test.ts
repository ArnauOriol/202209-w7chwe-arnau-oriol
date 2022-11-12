import type { Response } from "express";
import CustomError from "../../CustomError/CustomError";
import { generalError, notFoundError } from "./errors";

describe("Given a notFoundPage middleware", () => {
  describe("When it receives a request", () => {
    const expectedMessage = {
      message: "Endpoint not found",
    };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue(expectedMessage),
    };
    const expectedStatus = 404;

    test("Then it should call its method status with a 200", () => {
      notFoundError(null, res as Response);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call its method json with the message 'Endpoint not found'", () => {
      notFoundError(null, res as Response);

      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
});

describe("Given the generalError function", () => {
  describe("When it receives a request and a customError with a status 500", () => {
    test("Then it should call its method status with a 500 and public message 'Coronel pete'", () => {
      const expectedStatus = 500;
      const expectedMessage = { error: "Coronel pete" };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new CustomError("", expectedStatus, expectedMessage.error);

      generalError(error, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe("When it receives a request and a customError with no status and no public message", () => {
    test("Then it should call its method status with a 500 and public message 'Something went wrong, try again in 5 minutes'", () => {
      const error = new Error("");
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedStatus = 500;
      const expectedMessage = { error: "Something went wrong" };

      generalError(error as CustomError, null, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
});
