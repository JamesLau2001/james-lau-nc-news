const { nextTick } = require("process");
const db = require("../db/connection");
const fs = require("fs/promises");
const { checkExists } = require("../db/seeds/utils");
const e = require("express");
const { promiseHooks } = require("v8");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.selectApi = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((documents) => {
      const parsedDocuments = JSON.parse(documents);
      return parsedDocuments;
    });
};

exports.selectArticleById = (article_id) => {
  let queryString = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles 
                      LEFT JOIN comments ON comments.article_id = articles.article_id 
                      WHERE articles.article_id = $1 
                      GROUP BY articles.article_id`;
  const queryValue = [];
  const queryProms = [];
  queryValue.push(article_id);
  queryProms.push(checkExists("articles", "article_id", article_id));
  queryProms.push(db.query(queryString, queryValue));

  return Promise.all(queryProms).then((promResults) => {
    return promResults[1].rows[0];
  });
};

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  const sort_byArray = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const orderArray = ["ASC", "DESC"];
  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) as comment_count FROM articles`;
  const queryValue = [];
  queryString += ` LEFT JOIN comments ON comments.article_id = articles.article_id`;
  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryValue.push(topic);
  }
  if (sort_byArray.includes(sort_by)) {
    queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by}`;
  } else {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  if (orderArray.includes(order.toUpperCase())) {
    queryString += ` ${order.toUpperCase()}`;
  } else {
    return Promise.reject({ status: 400, message: "bad request" });
  }
  return db.query(queryString, queryValue).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "not found" });
    }
    return rows;
  });
};

exports.selectComments = (article_id) => {
  let queryString = `SELECT * FROM comments`;
  const queryValue = [];
  const queryProms = [];

  queryString += ` WHERE article_id = $1`;
  queryValue.push(article_id);
  queryProms.push(checkExists("articles", "article_id", article_id));
  queryString += ` ORDER BY created_at DESC`;
  queryProms.push(db.query(queryString, queryValue));

  return Promise.all(queryProms).then((promResults) => {
    return promResults[1].rows;
  });
};

exports.postNewComment = (article_id, commentToPost) => {
  const { body, author } = commentToPost;
  let queryString = `INSERT INTO comments (body, article_id, author) 
                    VALUES ($1, $2, $3) RETURNING author as username, body`;
  const queryValue = [];
  const queryProms = [];

  queryValue.push(body, article_id, author);
  queryProms.push(checkExists("articles", "article_id", article_id));
  queryProms.push(db.query(queryString, queryValue));

  return Promise.all(queryProms).then((promResults) => {
    return promResults[1].rows[0];
  });
};

exports.selectArticleToPatch = (article_id, inc_votes) => {
  const queryString = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*`;
  const queryValue = [inc_votes];
  const queryProms = [];

  queryValue.push(article_id);
  queryProms.push(checkExists("articles", "article_id", article_id));
  queryProms.push(db.query(queryString, queryValue));

  return Promise.all(queryProms).then((promResults) => {
    return promResults[1].rows[0];
  });
};

exports.selectCommentToDelete = (comment_id) => {
  let queryString = ``;
  const queryValue = [];
  const queryProms = [];

  queryString += `DELETE FROM comments WHERE comment_id = $1 RETURNING*`;
  queryValue.push(comment_id);
  queryProms.push(checkExists("comments", "comment_id", comment_id));
  queryProms.push(db.query(queryString, queryValue));

  return Promise.all(queryProms).then((promResults) => {
    return promResults[1].rows[0];
  });
};

exports.selectAllUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
