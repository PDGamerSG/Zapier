import express from "express"
import { prisma } from "../lib/prisma.ts";

const app = express();

//the url looks like
//https://hooks.zapier.com/hooks/catch/1723049/231213/

app.post("/hooks/catch/:userId/:zapId", async (req,res) =>{
    const userId = req.params.userId;
    const zapId = req.params.userId;
    const body = req.body;

    //store in db a new trigger
    await prisma.$transaction(async tx =>{
        const run  = await prisma.zapRun.create({
            data:{
                zapId:zapId,
                metadata: body
            }
        });
        await prisma.zapRunOutbox.create({
            data:{
                zapRunId : run.id
            }
        })

    })
    await prisma.zapRun.create({
        data:{
            zapId: zapId,
        }
    })
    //push it on to a queue(kafka/redis)
    kafkaPublisher.publish({

    })
})
