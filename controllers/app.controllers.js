const { promises } = require("supertest/lib/test");
const {
  selectTopics,
  selectApi,
  selectArticleById,
  selectArticles,
  selectComments,
  postNewComment,
  selectArticleToPatch,
  selectCommentToDelete,
  selectAllUsers,
  selectUser,
  selectCommentToPatch,
  selectArticleToPost,
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
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (request, response, next) => {
  const { sort_by, order, topic } = request.query;

  selectArticles(sort_by, order, topic)
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({ message: "not found" });
      }
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
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (request, response, next) => {
  const { article_id } = request.params;
  const commentToPost = request.body;
  postNewComment(article_id, commentToPost)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  selectArticleToPatch(article_id, inc_votes)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  selectCommentToDelete(comment_id)
    .then((comment) => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (request, response, next) => {
  selectAllUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUser = (request, response, next) => {
  const { username } = request.params;
  selectUser(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (request, response, next) => {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;
  selectCommentToPatch(comment_id, inc_votes)
    .then((newComment) => {
      response.status(200).send({ newComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (request, response, next) => {
  const articleToPost = request.body
  selectArticleToPost(articleToPost)
    .then((newArticle) => {
      response.status(201).send({ newArticle });
    })
    .catch((err) => {
      next(err);
    });
};
