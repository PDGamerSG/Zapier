import express from "express"
import { prisma } from "../lib/prisma.js";

const app = express();
app.use(express.json());

//the url looks like
//https://hooks.zapier.com/hooks/catch/1723049/231213/

app.post("/hooks/catch/:userId/:zapId", async (req,res) =>{
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;

    //store in db a new trigger
    await prisma.$transaction(async tx =>{
        const run  = await tx.zapRun.create({
            data:{
                zapId:zapId,
                metadata: body
            }
        });
        await tx.zapRunOutbox.create({
            data:{
                zapRunId : run.id
            }
        })

    })

    res.json({ message: "Webhook received" });
})
app.listen(3000);
