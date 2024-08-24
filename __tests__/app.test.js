const { app } = require("../app/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeAll(() => seed(data));
afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET 200: responds with a body of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const {
          body: { topics },
        } = response;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
  });
});

describe("/api", () => {
  test("GET 200: responds with a body that documents all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const {
          body: { documents },
        } = response;
        for (const keys in documents) {
          const endPoint = documents[keys];
          expect(endPoint).toHaveProperty("description");
          if (keys.includes("/api/")) {
            expect(endPoint).toHaveProperty("queries");
            expect(endPoint).toHaveProperty("exampleResponse");
          }
        }
        expect(documents).toBeInstanceOf(Object);
      });
  });
});
