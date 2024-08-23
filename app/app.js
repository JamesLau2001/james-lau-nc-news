const {getTopics} = require('../controllers/app.controllers')

const express = require("express")
const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)

app.use((err, request, response, next)=>{
    console.log(err)
    response.status(500).send({msg: "internal server error"})
})
module.exports = {app}