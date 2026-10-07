import express from "express";

import {
    getTodos,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo
} from "../controllers/todoController.js";

const router = express.Router();

router.get("/", getTodos);

router.post("/", createTodo);

router.put("/:id", updateTodo);

router.patch("/:id/done", toggleTodo);

router.delete("/:id", deleteTodo);

export default router;