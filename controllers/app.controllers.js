const { promises } = require("supertest/lib/test");
const {
  selectTopics,
  selectApi,
  selectArticleById,
  selectArticles,
  selectComments,
  postNewComment,
} = require("../models/app.models");

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApi = (request, response, next) => {
  selectApi()
    .then((documents) => {
      response.status(200).send({ documents });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id)
    .then((article) => {
      if (article === undefined) {
        return Promise.reject({ message: "article does not exist" });
      }
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (request, response, next) => {
  selectArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (request, response, next) => {
  const { article_id } = request.params;
  selectComments(article_id)
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({ message: "article does not exist" });
      }
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (request, response, next) => {
  const {article_id} = request.params
  const commentToPost = request.body
  postNewComment(article_id, commentToPost).then((comment)=>{
    response.status(201).send({comment})
  })
  .catch((err)=>{
    next(err)
  })
}
