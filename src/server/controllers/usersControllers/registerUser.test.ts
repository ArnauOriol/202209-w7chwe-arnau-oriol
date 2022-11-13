import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../../database/models/User";
import registerUser from "./registerUser";
import mongoose from "mongoose";
import type { RegisterData } from "../../types/types";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given a registerUser controller", () => {
  describe("When it receives a request with username 'Arnau', password '1234', and email 123@arnau.com and is not in the database", () => {
    test("Then its method status should be called with a 201 and its method json should be called with Arnau data", async () => {
      const expectedStatusCode = 201;
      const registerData: RegisterData = {
        username: "Arnau",
        password: "1234",
        email: "123@arnau.com",
      };
      const req: Partial<Request> = {
        body: registerData,
      };
      const hashedPassword = "1234hashed";
      const userId = new mongoose.Types.ObjectId();

      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      User.create = jest.fn().mockResolvedValue({
        ...registerData,
        password: hashedPassword,
        _id: userId,
      });

      await registerUser(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          username: registerData.username,
          email: registerData.email,
          id: userId,
        },
      });
    });
  });

  describe("When it receives a request with username 'Arnau', password '1234', and email 123@arnau.com and it already is in the database", () => {
    test("Then it should call the next function with a CustomError", async () => {
      const registerData: RegisterData = {
        username: "Arnau",
        password: "1234",
        email: "123@arnau.com",
      };
      const req: Partial<Request> = {
        body: registerData,
      };
      const next = jest.fn();
      const error = new Error("Cosas");

      User.create = jest.fn().mockRejectedValue(error);

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
