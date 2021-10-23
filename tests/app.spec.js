const app = require('../app');
const request = require('supertest');
const Users = require("../src/models/users.model");
const mongoose = require("mongoose");
beforeEach((done) => {
  mongoose.connect("mongodb://localhost:27017/maximaderas",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  });
});

const newUser = {
    "name": "Jose Juan",
    "lastName": "Rivera",
    "email": "jriveraj23@gmail.com",
    "password": "987123",
    "status": "active"
}

test("POST /api/save-user", async () => {
  await request(app).post("/api/save-user")
    .send(newUser)
    .expect(201)
    .then(async (response) => {
      console.log(response);
    });
});
