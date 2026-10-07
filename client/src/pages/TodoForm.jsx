import { useEffect, useRef, useState } from "react";

const TodoForm = ({ todo, submitting, onSubmit, onCancel }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const formRef = useRef(null);
    const titleRef = useRef(null);

    const isEditing = Boolean(todo);

    useEffect(() => {
        if (todo) {
            setTitle(todo.title);
            setDescription(todo.description || "");
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            titleRef.current?.focus();
        } else {
            setTitle("");
            setDescription("");
        }
    }, [todo]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!title.trim() || submitting) return;

        const success = await onSubmit({
            title: title.trim(),
            description: description.trim()
        });

        if (success && !isEditing) {
            setTitle("");
            setDescription("");
            titleRef.current?.focus();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Escape" && isEditing) onCancel();
    };

    return (
        <form
            ref={formRef}
            className={`card form ${isEditing ? "form-editing" : ""}`}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
        >
            <h2>{isEditing ? "Edit todo" : "Add a todo"}</h2>

            <div className="field">
                <label htmlFor="title">Title</label>
                <input
                    ref={titleRef}
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    maxLength={200}
                    required
                    disabled={submitting}
                />
            </div>

            <div className="field">
                <label htmlFor="description">
                    Description <span className="muted">(optional)</span>
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add some details..."
                    maxLength={1000}
                    rows={3}
                    disabled={submitting}
                />
                <small className="muted counter">{description.length}/1000</small>
            </div>

            <div className="actions">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting || !title.trim()}
                >
                    {submitting
                        ? "Saving..."
                        : isEditing
                        ? "Update todo"
                        : "Add todo"}
                </button>

                {isEditing && (
                    <button
                        type="button"
                        className="btn"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default TodoForm;