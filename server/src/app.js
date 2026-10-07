import express from "express";
import cors from "cors";
import todoRouter from "./routes/todoRouter.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173"
    })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "TODO API is running"
    });
});

app.use("/api/todos", todoRouter);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use(errorHandler);

export default app;