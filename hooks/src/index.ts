import express from "express"

const app = express();

//the url looks like
//https://hooks.zapier.com/hooks/catch/1723049/231213/


app.post("/hooks/catch/:userId/:zapId",(req,res) =>{
    const userId = req.params.userId;
    const zapId = req.params.userId;

    //store in db a new trigger

    //push it on to a queue(kafka/redis)
})
