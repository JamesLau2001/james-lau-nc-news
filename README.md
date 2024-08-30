# Northcoders News API
To access the service provided by this project, please go to https://james-lau-nc-news.onrender.com/.

This project is an API, that revolves around collecting and manipulating databases.

To fork and clone this repository, fork a copy of the original repository and copy the unnique link to your dashboard, and run $git clone <link>.

To run this locally, ensure to set up the environment variables (.env.test and .env.development), connecting to their respective databases. In order to ensure everything has been set up correctly, please run $npm install, $npm run set-up, $npm run seed, and to run tests please run $npm test app.

GET /api/topics has been added: run a GET request on the endpoint '/api/topics' to retrieve a body of all the topics.

GET /api has been added: run a GET request on the endpoint '/api' to retrieve a body of documentation for all endpoints.
Note to add more information in endpoints.json whenever a new endpoint is added, including when applicable: a brief description of the purpose and functionality of the enpoint, acceptable queries, format of the request body, and example response.

GET /api/articles/:article_id has been added: run a get request on the endpoint '/api/articles/:article_id' to retrieve a body of a single article by its id.

GET /api/articles has been added: run a get request on the endpoint '/api/articles' to retrieve a body of an array of all articles with comment counts.

GET /api/articles/:article_id/comments has been added: run a get request on the endpoint '/api/articles/:article_id/comments' to retrieve a body of an array of all comments for a given article_id.

POST /api/articles/:article_id/comments has been added: run a post request on '/api/articles/:article_id/comments' to post a new comment into the comments table, and retrieve the entered comment.

PATCH /api/articles/:article_id has been added: run a patch request on '/api/articles/:article_id' to patch an existing article to update its votes, and retrieve this new article.

DELETE /api/comments/:comment_id has been added: run a delete request on '/api/comments/:comment_id' to delete a comment by its comment_id.

GET /api/users has been added: run a get request on '/api/users' to retrieve all users

GET /api/articles? has been added: run a get request on '/api/articles?' to retrieve an array of article objects ordered by chosen queries (column name by either ascending or descending). This endpoint also now takes a topic query, which filters the response by a chosen topic.

GET /api/articles/:article_id has been updated: running a get request on this endpoint will also now show the comment_count.

POST /api/articles has been added: runninng a post request on '/api/articles/ will post a new article to articles, and accepts the queries: author, title, body, topic, and optional article_img_url. This will also retrieve the new posted article object.

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
