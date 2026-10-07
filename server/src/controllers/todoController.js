import { pool } from "../config/database.js";

export const getTodos = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                title,
                description,
                done,
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM todos
            ORDER BY created_at DESC
        `);

        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const createTodo = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        const result = await pool.query(
            `
                INSERT INTO todos (title, description)
                VALUES ($1, $2)
                RETURNING
                    id,
                    title,
                    description,
                    done,
                    created_at AS "createdAt",
                    updated_at AS "updatedAt"
            `,
            [title, description || ""]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const updateTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid todo ID"
            });
        }

        const result = await pool.query(
            `
                UPDATE todos
                SET
                    title = $1,
                    description = $2,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $3
                RETURNING
                    id,
                    title,
                    description,
                    done,
                    created_at AS "createdAt",
                    updated_at AS "updatedAt"
            `,
            [title, description || "", id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const toggleTodo = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid todo ID"
            });
        }

        const result = await pool.query(
            `
                UPDATE todos
                SET
                    done = NOT done,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
                RETURNING
                    id,
                    title,
                    description,
                    done,
                    created_at AS "createdAt",
                    updated_at AS "updatedAt"
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid todo ID"
            });
        }

        const result = await pool.query(
            `
                DELETE FROM todos
                WHERE id = $1
                RETURNING id
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};