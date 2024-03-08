import { MessageModel } from "../src/models/contact_model";
import mongoose from "mongoose";
import { servers } from "../src/index";
import dotenv from "dotenv";
import supertest from "supertest";
import app from "../src/index";
import express from "express";
dotenv.config();

jest.setTimeout(30000);

const request = supertest(app);
const MONGO_URL: string = process.env.MONGO_URL!;
beforeAll(async () => {
  servers;
  await mongoose.connect(MONGO_URL);
});
afterEach(async () => {
  servers.close();
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});


let token: string | undefined;
describe('User login', () => {
  beforeAll(async () => {
    // Register a user for login tests
    const userData = {
      email: "test@example.com",
      password: "passwordyes",
      userRole: "admin",
    };
    await supertest(app).post("/auth/register").send(userData);
  });

  it("should log in the user and return an access token", async () => {
    const userData = {
      email: "test@example.com",
      password: "passwordyes",
    };

    const response = await supertest(app)
      .post("/auth/login")
      .send(userData)
      .expect(200);
      token = response.body.token;
      console.log("tokennnn",response.body.token);
      
    expect(response.body).toHaveProperty("token");
  });
});
describe("Message Model", () => {
  it("should create a new message", async () => {
    const messageData = {
      message: "This is a test message.",
      email: "test@gmail.com",
      name: "test",
    };

    const newMessage = await MessageModel.create(messageData);
    expect(newMessage.message).toBe(messageData.message);
    expect(newMessage.email).toEqual(messageData.email);
  });

  it("should return 400 error if email is missing", async () => {
    const messageData = {
      message: "This is a test message.",
      name: "test",
    };

    try {
      await MessageModel.create(messageData);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.name).toBe("ValidationError");
    }
  });
});

describe("Contact Controller", () => {
  describe("POST /messages", () => {
    it("should create a new message", async () => {
      const messageData = {
        name: "Test User",
        email: "test@example.com",
        message: "This is a test message",
      };

      const response = await request
        .post("/messages/create")
        .send(messageData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(messageData.name);
      expect(response.body.data.email).toBe(messageData.email);
      expect(response.body.data.message).toBe(messageData.message);
    });

    it("should return 400 if required fields are missing", async () => {
      const messageData = {
        email: "test@example.com",
        message: "This is a test message",
      };

      const response = await request
        .post("/messages/create")
        .send(messageData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe("Name, email, and message are required");
    });

    it("should return 400 if message validation fails", async () => {
      const messageData = {
        name: "Test User",
        email: "invalid_email",
        message: "This is a test message",
      };

      const response = await request
        .post("/messages/create")
        .send(messageData)
        .expect(400);

      expect(response.body.error).toBe("Invalid email format");
    });
  });
  describe("GET /messages", () => {
    it("should fetch all messages", async () => {
      const response = await request
        .get("/messages")
        .set("Cookie", `jwt=${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("DELETE /messages/:id", () => {
    it("should delete a message by ID", async () => {
      const messageData = {
        name: "Test User",
        email: "test@example.com",
        message: "This is a test message",
      };

      const newMessage = await MessageModel.create(messageData);

      const response = await request
        .delete(`/messages/${newMessage._id}`)
        .set("Cookie", `jwt=${token}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.name).toBe(messageData.name);
      expect(response.body.email).toBe(messageData.email);
      expect(response.body.message).toBe(messageData.message);

      const deletedMessage = await MessageModel.findById(newMessage._id);
      expect(deletedMessage).toBeNull();
    });
  });
});
