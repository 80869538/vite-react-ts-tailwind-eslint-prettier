import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app";
import Logger from "../src/utils/logger";
import config from "config";
import { connectRedis } from "../src/utils/connectRedis";
import redisClient from "../src/utils/connectRedis";
const dbUrl = `mongodb://${config.get("mongoUser")}:${config.get(
  "mongoPass"
)}@${config.get("host_name")}:${config.get("mongo_port")}/${config.get(
  "dbName"
)}?authSource=admin`;

/* Connecting to the database before each test. */
beforeAll(async () => {
  await mongoose.connect(dbUrl);
  await mongoose.connection.db.dropDatabase();
  await connectRedis();
});

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection
    .close()
    .then(() => console.debug("MongoDB connection closed"))
    .catch((err) => console.debug(err.message));
  await redisClient.flushDb();
  await redisClient
    .quit()
    .then(() => console.debug("Redis client disconnected"))
    .catch((err) => {
      console.debug(err.message);
    });
});

// Test for the healthChecker route
describe("GET /healthChecker", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/healthChecker");
    expect(res.status).toBe(200);
  });
});

//Test for register route
describe("POST /api/auth/register", () => {
  interface Payload {
    name?: string;
    email?: string;
    password?: string;
    passwordConfirm?: string;
  }

  interface Data {
    payload: Payload;
    expectedCode: number;
    expectedMessage: string;
  }

  const dataValid: Data[] = [
    {
      payload: {
        name: "John Doe",
        email: "askdj@gmail.com",
        password: "12345678",
        passwordConfirm: "12345678",
      },
      expectedCode: 201,
      expectedMessage: "success",
    },
  ];

  const dataInvalid: Data[] = [
    {
      payload: {
        name: "John Doe",
        email: "askdj@gmail.com",
        password: "12345678",
        passwordConfirm: "12345678",
      },
      expectedCode: 409,
      expectedMessage: "Email already exists",
    },
    {
      payload: {
        name: "John Doe",
        email: "djlaskjd@fdnf",
        password: "12345678",
        passwordConfirm: "12345678",
      },
      expectedCode: 400,
      expectedMessage: "Invalid email",
    },

    {
      payload: {
        email: "djlaskjd@fdnf.com",
        password: "12345678",
        passwordConfirm: "12345678",
      },
      expectedCode: 400,
      expectedMessage: "Name is required",
    },

    {
      payload: {
        name: "dsadas",
        password: "12345678",
        passwordConfirm: "12345678",
      },
      expectedCode: 400,
      expectedMessage: "Email is required",
    },

    {
      payload: {
        name: "dsadas",
        email: "djlasd@fdnf.com",
        passwordConfirm: "12345678",
      },
      expectedCode: 400,
      expectedMessage: "Password is required",
    },

    {
      payload: {
        name: "dsadas",
        email: "daskjd@fdnf.com",
        password: "123456",
        passwordConfirm: "123456",
      },
      expectedCode: 400,
      expectedMessage: "Password must be more than 8 characters",
    },

    {
      payload: {
        name: "dsadas",
        email: "djlaskjd@fdnfdsad.com",
        password: "123456789",
        passwordConfirm: "1234567829",
      },
      expectedCode: 400,
      expectedMessage: "Passwords do not match",
    },
  ];

  // success with valid data
  it.each(dataValid)("should return 201 OK", async (item: Data) => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(item.payload);
    expect(res.status).toBe(item.expectedCode);
    expect(res.body.status).toBe(item.expectedMessage);
  });
  //error with invalid data
  it.each(dataInvalid)("should return error", async (item: Data) => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(item.payload);
    expect(res.status).toBe(item.expectedCode);
    expect(res.body.error).toBe(item.expectedMessage);
  });
});

//Test for login route
describe("POST /api/auth/login", () => {
  interface Payload {
    email?: string;
    password?: string;
  }

  interface Data {
    payload: Payload;
    expectedCode: number;
    expectedMessage: string;
  }

  const dataValid: Data[] = [
    {
      payload: {
        email: "askdj@gmail.com",
        password: "12345678",
      },
      expectedCode: 200,
      expectedMessage: "success",
    },
  ];

  const dataInvalid: Data[] = [
    {
      payload: {
        password: "12345678",
      },
      expectedCode: 400,
      expectedMessage: "Email is required",
    },
    {
      payload: {
        email: "askdj@gmail.com",
      },
      expectedCode: 400,
      expectedMessage: "Password is required",
    },
    {
      payload: {
        email: "askdj@gmail",
        password: "123456789",
      },
      expectedCode: 400,
      expectedMessage: "Invalid email or password",
    },
    {
      payload: {
        email: "askdj@gmail.com",
        password: "123456789",
      },
      expectedCode: 401,
      expectedMessage: "Invalid email or password",
    },
  ];

  // success with valid data
  it.each(dataValid)("should return 200 OK", async (item: Data) => {
    let res = await request(app).post("/api/auth/login").send(item.payload);
    expect(res.status).toBe(item.expectedCode);
    expect(res.body.status).toBe(item.expectedMessage);
    console.log(res.headers);
    const cookies: string[] = res.headers["set-cookie"];
    res = await request(app).get("/api/users/me").set("Cookie", cookies);
    expect(res.status).toBe(200);
    expect(res.body.data.user.name).toBe("John Doe");
  });

  //error with invalid data
  it.each(dataInvalid)("should return error", async (item: Data) => {
    const res = await request(app).post("/api/auth/login").send(item.payload);
    expect(res.status).toBe(item.expectedCode);
    expect(res.body.error).toBe(item.expectedMessage);
  });
});
