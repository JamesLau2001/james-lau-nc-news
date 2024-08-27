const { nextTick } = require("process");
const db = require("../db/connection");
const fs = require("fs/promises");
const {checkExists} = require("../db/seeds/utils")

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
  let queryString = `SELECT * FROM articles`;
  const queryValue = [];
  const queryProms = []
  if (article_id) {
    queryString += ` WHERE article_id = $1`;
    queryValue.push(article_id);
    queryProms.push(checkExists("articles", "article_id", article_id))
  }
  queryProms.push(db.query(queryString, queryValue))
  return Promise.all(queryProms).then((promResults) =>{
    if (queryProms.length === 1){
      return promResults[0].rows
    } else {
      return promResults[1].rows[0]
    }
  })
  
};

exports.selectArticles = () => {
  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) as comment_count FROM articles`;
  queryString += ` LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id`;
  queryString += ` ORDER BY created_at DESC`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.selectComments = (article_id) => {
  let queryString = `SELECT * FROM comments`;
  const queryValue = [];
  const queryProms = []
  if (article_id) {
    queryString += ` WHERE article_id = $1`;
    queryValue.push(article_id);
    queryProms.push(checkExists("articles", "article_id", article_id))
  }
  queryString += ` ORDER BY created_at DESC`;
  queryProms.push(db.query(queryString, queryValue))
  return Promise.all(queryProms).then((promResults) =>{
    if (queryProms.length === 1){
      return promResults[0].rows
    } else {
      return promResults[1].rows
    }
  })
};

exports.postNewComment = (article_id, commentToPost) => {
  const { body, author } = commentToPost;
  let queryString = `INSERT INTO comments (body, article_id, author) 
                    VALUES ($1, $2, $3) RETURNING author as username, body`;
  const queryValue = []
  const queryProms = []
  if(article_id && commentToPost){
    queryValue.push(body, article_id, author)
    queryProms.push(checkExists("articles", "article_id", article_id))
  }
  queryProms.push(db.query(queryString, queryValue))
  return Promise.all(queryProms).then((promResults) =>{
    
    if (queryProms.length === 1){
      return promResults[0].rows[0]
    } else {
      return promResults[1].rows[0]
    }
  })
};
