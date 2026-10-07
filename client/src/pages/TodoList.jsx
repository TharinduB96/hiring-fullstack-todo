import TodoItem from "./TodoItem";

const EMPTY_MESSAGES = {
    all: "No todos yet. Add your first one above!",
    active: "Nothing left to do. Nice work!",
    completed: "No completed todos yet."
};

const TodoList = ({ todos, hasAnyTodos, filter, pendingIds, editingId, onToggle, onEdit, onDelete }) => {
    if (todos.length === 0) {
        return (
            <p className="empty">
                {hasAnyTodos ? EMPTY_MESSAGES[filter] : EMPTY_MESSAGES.all}
            </p>
        );
    }

    return (
        <section aria-label="Todo list">
            <ul className="todo-list">
                {todos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        pending={pendingIds.includes(todo.id)}
                        isEditing={editingId === todo.id}
                        onToggle={onToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
        </section>
    );
};

export default TodoList;