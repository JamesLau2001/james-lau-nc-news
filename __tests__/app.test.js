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

describe("/api/articles/:article_id", () => {
  test("GET 200: /api/articles/:article_id returns a body of an article based on its article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const {
          body: { article },
        } = response;

        expect(Object.keys(article).length).toBe(8);
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });
  test("GET 404: sends an appropiate status and error message whhen given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/3000")
      .expect(404)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("article does not exist");
      });
  });
  test("GET 400: sends an appropiate status and error message whhen given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: returns a body of an array of article objects, with the correct information", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const {
          body: { articles },
        } = response;
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
});
