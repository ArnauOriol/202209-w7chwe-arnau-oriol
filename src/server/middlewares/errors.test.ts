import type { Response } from "express";
import notFoundError from "./errors";

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
