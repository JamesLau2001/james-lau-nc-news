const { app } = require("../app/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeAll(() => seed(data));
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
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

describe("GET /api", () => {
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

describe("GET /api/articles/:article_id", () => {
  test("GET 200: /api/articles/:article_id returns a body of an article based on its article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const {
          body: { article },
        } = response;
        expect(Object.keys(article).length).toBe(9);
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "11",
        });
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

        expect(message).toBe("not found");
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

describe("GET /api/articles", () => {
  test("GET 200: returns a body of an array of article objects, with the correct information", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const {
          body: { articles },
        } = response;
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles.length).toBe(13);
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

describe("GET /api/articles/:article_id/comments", () => {
  test("GET 200: returns a body of an array of all comments for a given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const {
          body: { comments },
        } = response;
        expect(comments).toBeSortedBy("created_at", { descending: true });
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("GET 404: sends an appropiate status and error message whhen given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("not found");
      });
  });
  test("GET 400: sends an appropiate status and error message whhen given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST 201: Adds a body of a comment to comments, and responds with said comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        body: "new added body",
        author: "butter_bridge",
      })
      .expect(201)
      .then((response) => {
        const {
          body: { comment },
        } = response;
        expect(Object.keys(comment).length).toBe(2);
        expect(comment.body).toBe("new added body");
        expect(comment.username).toBe("butter_bridge");
      });
  });
  test("POST 404: returns appropiate error message when given a valid but non-existent id", () => {
    return request(app)
      .post("/api/articles/15/comments")
      .send({
        body: "new added body",
        author: "butter_bridge",
      })
      .expect(404)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("not found");
      });
  });
  test("POST 400: responds with an appropriate status and error message when provided with a bad comment(missing entries)", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        body: "new added body",
      })
      .expect(400)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("bad request");
      });
  });
  test("400: responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .post("/api/articles/hello/comments")
      .expect(400)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("bad request");
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("200: responds with the patched body", () => {
    return request(app)
      .patch("/api/articles/1")
      .expect(200)
      .send({ inc_votes: 1 })
      .then((response) => {
        const {
          body: { article },
        } = response;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: returns appropiate error message when given a valid but non-existent id", () => {
    return request(app)
      .patch("/api/articles/50")
      .send({ inc_votes: 1 })
      .expect(404)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("not found");
      });
  });
  test("400: responds with an appropriate status and error message when provided with missing entries", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("bad request");
      });
  });
  test("400: responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .patch("/api/articles/hello")
      .expect(400)
      .then((response) => {
        const {
          body: { message },
        } = response;

        expect(message).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes the specified comment by its id and sends no body back", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("404: responds with an appropriate status and error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("not found");
      });
  });
  test("400: responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with a body of an array of all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const {
          body: { users },
        } = response;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(Object.keys(user).length).toBe(3);
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("GET /api/articles?", () => {
  test("200: returns a body of a sorted array based on sort_by and order queries", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then((response) => {
        const {
          body: { articles },
        } = response;
        expect(articles).toBeSortedBy("title", { ascending: true });
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(Object.keys(article).length).toBe(8);
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
  test("400: responds with an appropriate status and error message when given an invalid queries", () => {
    return request(app)
      .get("/api/articles?sort_by=invalidColumn&order=asc")
      .expect(400)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("bad request");
      });
  });
  test("200: returns a body of a sorted array filtered by a topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((response) => {
        const {
          body: { articles },
        } = response;
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles.length).toBe(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
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
  test("404: responds with an appropriate status and error message when given an invalid queries", () => {
    return request(app)
      .get("/api/articles?topic=invalid")
      .expect(404)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: responds with an user object by a given username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then((response) => {
        const {
          body: { user },
        } = response;
        expect(Object.keys(user).length).toBe(3);
        expect(user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("404: responds with an appropriate status and error message when given a wrong input", () => {
    return request(app)
      .get("/api/users/butterbridge")
      .expect(404)
      .then((response) => {
        const {
          body: { message },
        } = response;
        expect(message).toBe("not found");
      });
  });
  
});
