import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";
import connectDatabase from "../../database/connectDatabase";
import User from "../../database/models/User";
import request from "supertest";
import app from "../app";
import type { RegisterData } from "../types/types";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

describe("Given the usersRouter with POST /signup endpoint", () => {
  describe("When it receives a request with {username: 'Arnau', password: '1234', email: sr@arnau.com} that is not on the database, on its body", () => {
    test("Then it should respond with status 201 and the message: 'User Arnau successfully created'", async () => {
      const requestBody: RegisterData = {
        username: "Arnau",
        password: "1234",
        email: "sr@arnau.com",
      };
      const expectedStatus = 201;
      const expectedMessage = { message: "User Arnau successfully created" };

      const res = await request(app)
        .post("/users/signup")
        .send(requestBody)
        .expect(expectedStatus);

      expect(res.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives a request with {username: 'Yo', password: '33', email: y@o.com} that is on the database, on its body", () => {
    test("Then it should respond with status 500 and the message: 'Error on registration'", async () => {
      await User.create({
        username: "Yo",
        password: await bcrypt.hash("33", 10),
        email: "y@o.com",
      });
      const requestBody: RegisterData = {
        username: "Yo",
        password: "33",
        email: "y@0.com",
      };
      const expectedStatus = 500;
      const expectedMessage = { error: "Error on registration" };

      const res = await request(app)
        .post("/users/signup")
        .send(requestBody)
        .expect(expectedStatus);

      expect(res.body).toStrictEqual(expectedMessage);
    });
  });
});
