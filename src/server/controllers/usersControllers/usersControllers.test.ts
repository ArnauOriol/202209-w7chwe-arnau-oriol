import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../../../database/models/User";
import registerUser, { loginUser } from "./usersControllers";
import type { Credentials, RegisterData } from "../../types/types";
import mockUser from "../../../mocks/mockUser";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

const token = jwt.sign({}, "tokensecret");

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
      const expectedMessage = {
        message: "User Arnau successfully created",
      };

      await registerUser(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedMessage);
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
      const error = new Error("Cosas");

      User.create = jest.fn().mockRejectedValue(error);

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a loginUser controller", () => {
  describe("When it receives a request with username 'manoli' that is not in the database", () => {
    test("Then it should call the next function with an error", async () => {
      const loginData: Credentials = {
        username: "manoli",
        password: "unaqueoblidaria",
      };
      const req: Partial<Request> = {
        body: loginData,
      };
      const expectedMessage = new Error("Username not found");

      User.findOne = jest.fn();

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe("When it receives a request with username 'round' and an incorrect password", () => {
    test("Then it should call the next function with an error", async () => {
      const loginData: Credentials = {
        username: "round",
        password: "puchito",
      };
      const req: Partial<Request> = {
        body: loginData,
      };
      const expectedMessage = new Error("Password is incorrect");
      bcrypt.hash = jest.fn().mockReturnValue("ctangana");

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe("When it receives a request with username 'round' and the correct password 'ctangana'", () => {
    test("Then it should call its response method status with a 200", async () => {
      const loginData: Credentials = {
        username: "round",
        password: "ctangana",
      };
      const req: Partial<Request> = {
        body: loginData,
      };
      const userId = new mongoose.Types.ObjectId();
      const expectedStatusCode = 200;
      bcrypt.compare = jest.fn().mockReturnValue(true);

      User.findOne = jest.fn().mockResolvedValue({ ...mockUser, _id: userId });

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call its method json with a token", async () => {
      const loginData: Credentials = {
        username: "round",
        password: "ctangana",
      };
      const req: Partial<Request> = {
        body: loginData,
      };
      const userId = new mongoose.Types.ObjectId();

      User.findOne = jest.fn().mockResolvedValue({ ...mockUser, _id: userId });
      bcrypt.compare = jest.fn().mockReturnValue(true);
      jwt.sign = jest.fn().mockReturnValue(token);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(res.json).toHaveBeenCalledWith({ accessToken: token });
    });
  });
});
