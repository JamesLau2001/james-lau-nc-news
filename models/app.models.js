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
      const parsedDocuments = JSON.parse(documents);
      return parsedDocuments;
    });
};
