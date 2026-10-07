const TodoItem = ({ todo, pending, isEditing, onToggle, onEdit, onDelete }) => {
    return (
        <li
            className={`card todo ${todo.done ? "todo-done" : ""} ${
                isEditing ? "todo-editing" : ""
            } ${pending ? "todo-pending" : ""}`}
        >
            <input
                type="checkbox"
                className="todo-check"
                checked={todo.done}
                disabled={pending}
                onChange={() => onToggle(todo.id)}
                aria-label={`Mark "${todo.title}" as ${
                    todo.done ? "not done" : "done"
                }`}
            />

            <div className="todo-body">
                <h3>{todo.title}</h3>
                {todo.description && <p>{todo.description}</p>}
            </div>

            <div className="todo-actions">
                <button
                    type="button"
                    className="btn btn-small"
                    onClick={() => onEdit(todo)}
                    disabled={pending}
                >
                    Edit
                </button>
                <button
                    type="button"
                    className="btn btn-small btn-danger"
                    onClick={() => onDelete(todo.id)}
                    disabled={pending}
                >
                    Delete
                </button>
            </div>
        </li>
    );
};

export default TodoItem;