import {Router} from "express";
import { authMiddleware } from "./middleware.js";


const router = Router();

router.post("/signup",(req,res)=>{
    console.log("signup handler");
})
router.post("/signin",(req,res)=>{
    console.log("signup handler");
})
router.post("/user",authMiddleware,(req,res)=>{
    console.log("signup handler");
})

export const userRouter = router;
