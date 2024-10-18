import express from "express";
import cors from "cors";
import errHandlerMiddleware from "./middlewares/err.middleware.js";
import notfountMiddleware from "./middlewares/notfound.middleware.js";
import allRouter from "./routes/all.routes.js";

const app=express();
app.use(cors({
    origin : process.env.CORS_URL,
    credentials : true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api/v1",allRouter)


app.use(errHandlerMiddleware)
app.use(notfountMiddleware)
export default app;