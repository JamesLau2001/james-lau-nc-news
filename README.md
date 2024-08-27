# Northcoders News API

To run this locally, ensure to set up the environment variables (.env.test and .env.development), connecting to their respective databases.

GET /api/topics has been added: run a GET request on the endpoint '/api/topics' to retrieve a body of all the topics.

GET /api has been added: run a GET request on the endpoint '/api' to retrieve a body of documentation for all endpoints.
Note to add more information in endpoints.json whenever a new endpoint is added, including when applicable: a brief description of the purpose and functionality of the enpoint, acceptable queries, format of the request body, and example response.

GET /api/articles/:article_id has been added: run a get request on the endpoint '/api/articles/:article_id' to retrieve a body of a single article by its id.

GET /api/articles has been added: run a get request on the endpoint '/api/articles' to retrieve a body of an array of all articles with comment counts.

GET /api/articles/:article_id/comments has been added: run a get request on the endpoint '/api/articles/:article_id/comments' to retrieve a body of an array of all comments for a given article_id.

POST /api/articles/:article_id/comments has been added: run a post request on '/api/articles/:article_id/comments' to post a new comment into the comments table, and retrieve the entered comment.

PATCH /api/articles/:article_id has been added: run a patch request on '/api/articles/:article_id' to patch an existing article to update its votes, and retrieve this new article.
--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
