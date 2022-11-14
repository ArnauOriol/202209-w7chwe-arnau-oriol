import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
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
  describe("When it receives a request with {username: 'Arnau', password: '1234', email: sr@arnau.com} on its body", () => {
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
});
