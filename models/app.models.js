const db = require("../db/connection");
const fs = require("fs/promises");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.selectApi = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((documents) => {
      
      const parsedDocuments = JSON.parse(documents)
      return parsedDocuments
    });
};

exports.selectArticleById = (article_id) => {
  let queryString = `SELECT * FROM articles`;
  const queryValue = [];

  if (article_id) {
    queryString += ` WHERE article_id = $1`;
    queryValue.push(article_id);
  }
  return db.query(queryString, queryValue).then(({ rows }) => {
    return rows[0];
  });
};

exports.selectArticles = () =>{
  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) as comment_count FROM articles`
  queryString += ` LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id`
  return db.query(queryString).then(({rows})=>{
    return rows
  })
}