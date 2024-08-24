const {
  selectTopics,
  selectApi,
  selectArticleById,
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
