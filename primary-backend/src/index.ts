import express from "express"

const app = express();

app.use("/api/v1/user",userRouter);
app.use("/api/v1/zap",userRouter);
