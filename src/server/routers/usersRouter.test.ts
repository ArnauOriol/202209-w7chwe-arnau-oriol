import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";
import connectDatabase from "../../database/connectDatabase";
import User from "../../database/models/User";
import request from "supertest";
import app from "../app";
import type { Credentials, RegisterData } from "../types/types";

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
  describe("When it receives a request with username: 'Arnau', password: '1234' and email: sr@arnau.com that is not on the database, on its body", () => {
    test("Then it should respond with status 201 and the message: 'User Arnau successfully created'", async () => {
      const requestBody: RegisterData = {
        username: "Arnau",
        password: "1234",
        email: "sr@arnau.com",
      };
      const expectedStatus = 201;
      const expectedMessage = { message: "User Arnau successfully created" };

      const response = await request(app)
        .post("/users/signup")
        .send(requestBody)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedMessage);
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

describe("Given the usersRouter with POST /login endpoint", () => {
  describe("When it receives a request with username: 'Pitus' and password: 'tincgana' that is not registered on its body", () => {
    test("Then it should respond with status code 401 and the message 'Wrong credentials'", async () => {
      const requestBody: Credentials = {
        username: "Pitus",
        password: "tincgana",
      };
      const expectedStatus = 401;
      const expectedMessage = { error: "Wrong credentials" };

      const response = await request(app)
        .post("/users/login")
        .send(requestBody)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives a request with username: 'patatas' and password: 'fritas' that is registered on its body", () => {
    test("Then it should respond with status 200 and a token", async () => {
      await User.create({
        username: "patatas",
        password: await bcrypt.hash("fritas", 10),
        email: "patatas@fritas.com",
      });
      const requestBody: Credentials = {
        username: "patatas",
        password: "fritas",
      };
      const expectedStatus = 200;

      const response = await request(app)
        .post("/users/login")
        .send(requestBody)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("accessToken");
    });
  });
});
