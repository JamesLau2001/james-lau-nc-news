const {selectTopics} = require('../models/app.models')

exports.getTopics = (request, response) =>{
    selectTopics().then((topics)=>{  
        response.status(200).send({topics})
    })
}