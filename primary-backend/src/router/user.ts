import {Router} from "express";
import { authMiddleware } from "./middleware.js";
import { SignupSchema } from "../types/index.js";
import { prismaClient } from "../db/index.js";


const router = Router();

router.post("/signup",async (req,res)=>{
    const body = req.body.username;
    const parsedData = SignupSchema.safeParse(body);

    if(!parsedData.success){
        return res.status(411).json({
            message:"Incorrect inputs"
        })
    }
    const userExists = await prismaClient.user.findFirst({
        where:{
            email:parsedData.data.username
        }
    });
    if(userExists){
        return res.status(403).json({
            message:"User already exists"
        })
    }
    await prismaClient.user.create({
        data:{
            email:parsedData.data.username,
            password: parsedData.data.password,
            name: parsedData.data.name
        }
    })

    //await sendEmail();
    return res.json({
        message:"Please verify your account by checking your email"
    })

})
router.post("/signin",(req,res)=>{
    console.log("signup handler");
})
router.post("/user",authMiddleware,(req,res)=>{
    console.log("signup handler");
})

export const userRouter = router;
