const { selectTopics, selectApi } = require("../models/app.models");

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
