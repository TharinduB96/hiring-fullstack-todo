import { useEffect, useMemo, useState } from "react";
import { getTodos, createTodo, updateTodo, toggleTodo, deleteTodo} from "../api/todoApi";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

const FILTERS = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" }
];

const TodoPage = () => {
    const [todos, setTodos] = useState([]);
    const [editingTodo, setEditingTodo] = useState(null);
    const [filter, setFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [pendingIds, setPendingIds] = useState([]);
    const [error, setError] = useState("");

    const loadTodos = async () => {
        try {
            setLoading(true);
            setError("");
            setTodos(await getTodos());
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTodos();
    }, []);

    const addPending = (id) => setPendingIds((ids) => [...ids, id]);
    const removePending = (id) => setPendingIds((ids) => ids.filter((x) => x !== id));

    const handleSubmit = async (todoData) => {
        try {
            setSubmitting(true);
            setError("");

            if (editingTodo) {
                const updatedTodo = await updateTodo(editingTodo.id, todoData);
                setTodos((current) =>
                    current.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
                );
                setEditingTodo(null);
            } else {
                const newTodo = await createTodo(todoData);
                setTodos((current) => [newTodo, ...current]);
            }
            return true;
        } catch (error) {
            setError(error.message);
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            setError("");
            addPending(id);

            const updatedTodo = await toggleTodo(id);
            setTodos((current) =>
                current.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
            );
        } catch (error) {
            setError(error.message);
        } finally {
            removePending(id);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this todo?")) return;

        try {
            setError("");
            addPending(id);

            await deleteTodo(id);
            setTodos((current) => current.filter((t) => t.id !== id));

            if (editingTodo?.id === id) setEditingTodo(null);
        } catch (error) {
            setError(error.message);
        } finally {
            removePending(id);
        }
    };

    const visibleTodos = useMemo(() => {
        if (filter === "active") return todos.filter((t) => !t.done);
        if (filter === "completed") return todos.filter((t) => t.done);
        return todos;
    }, [todos, filter]);

    const remaining = todos.filter((t) => !t.done).length;

    return (
        <main className="page">
            <header className="page-header">
                <h1>My Todos</h1>
                {!loading && todos.length > 0 && (
                    <p className="muted">
                        {remaining} of {todos.length} remaining
                    </p>
                )}
            </header>

            {error && (
                <div role="alert" className="alert">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="btn-icon"
                        onClick={() => setError("")}
                        aria-label="Dismiss error"
                    >
                        ×
                    </button>
                </div>
            )}

            <TodoForm
                todo={editingTodo}
                submitting={submitting}
                onSubmit={handleSubmit}
                onCancel={() => setEditingTodo(null)}
            />

            {loading ? (
                <p className="muted center">Loading todos...</p>
            ) : (
                <>
                    {todos.length > 0 && (
                        <div className="filters" role="group" aria-label="Filter todos">
                            {FILTERS.map(({ value, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`chip ${filter === value ? "chip-active" : ""}`}
                                    aria-pressed={filter === value}
                                    onClick={() => setFilter(value)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}

                    <TodoList
                        todos={visibleTodos}
                        hasAnyTodos={todos.length > 0}
                        filter={filter}
                        pendingIds={pendingIds}
                        editingId={editingTodo?.id}
                        onToggle={handleToggle}
                        onEdit={setEditingTodo}
                        onDelete={handleDelete}
                    />
                </>
            )}
        </main>
    );
};

export default TodoPage;