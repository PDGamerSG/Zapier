import {Router} from "express";

const router = Router();

router.post("/",auteMiddleware,(req,res)=>{
    console.log("create a zap");
})
router.post("/",authMiddleware,(req,res)=>{
    console.log("signup handler");
})

export const userRouter = router;
