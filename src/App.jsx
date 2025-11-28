import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./App.css";

/* ============================= */
function SortableTodoItem({ todo, toggleDone, removeTodo, updateTodoText }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleBlur = () => {
    setEditing(false);
    if (editText.trim() !== "") {
      updateTodoText(todo.id, editText.trim());
    } else {
      setEditText(todo.text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBlur();
    else if (e.key === "Escape") {
      setEditing(false);
      setEditText(todo.text);
    }
  };
  // [텍스트] 자동 Bold 처리 함수
  const formatText = (text) => {
    return text.replace(/\[(.*?)\]/g, (match) => {
      return `<strong>${match}</strong>`;
    });
  };
  return (
    <li
      ref={setNodeRef}
      className={`todo-item ${todo.done ? "done" : ""}`}
      style={style}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        &#9776;
      </div>

      {editing ? (
        <input
          className="todo-edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span
          className="text"
          onClick={() => setEditing(true)}
          dangerouslySetInnerHTML={{ __html: formatText(todo.text) }}
        />
      )}

      {/* 완료 버튼 */}
      <button
        className={`btn-done ${todo.done ? "done-btn" : ""}`}
        onClick={() => toggleDone(todo.id)}
      >
        {todo.done ? "↑" : "✔"}
      </button>

      {/* 삭제 버튼 */}
      <button className="btn-delete" onClick={() => removeTodo(todo.id)}>
        ✕
      </button>
    </li>
  );
}

/* =============================
      Todo App
============================= */
function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleAdd = () => {
    if (!text.trim()) return;
    const newTodo = { id: Date.now(), text, done: false };
    setTodos([...todos, newTodo]);
    setText("");
  };

  const toggleDone = (id) => {
    setTodos((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      );
      return [
        ...updated.filter((t) => !t.done),
        ...updated.filter((t) => t.done),
      ];
    });
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const updateTodoText = (id, newText) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = todos.findIndex((t) => t.id === active.id);
    const overIndex = todos.findIndex((t) => t.id === over.id);
    const newOrder = arrayMove(todos, activeIndex, overIndex);

    const sorted = [
      ...newOrder.filter((t) => !t.done),
      ...newOrder.filter((t) => t.done),
    ];
    setTodos(sorted);
  };

  return (
    <div className="todo-app">
      <h2>할 일 목록</h2>

      <div className="todo-input-wrap">
        <input
          type="text"
          placeholder="할 일을 입력하세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleAdd} disabled={!text.trim()}>
          추가
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={todos.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="todo-list">
            {todos.map((todo) => (
              <SortableTodoItem
                key={todo.id}
                todo={todo}
                toggleDone={toggleDone}
                removeTodo={removeTodo}
                updateTodoText={updateTodoText}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="todo-meta">
        <div>{todos.length} items</div>
        <div>{todos.filter((t) => t.done).length} completed</div>
      </div>
    </div>
  );
}

/* =============================
      Counter Buttons / App
============================= */
function CounterButtonA() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>클릭 수: {count}</button>;
}

function CounterButtonB() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount((i) => i + 1)}>클릭 수: {count}</button>
  );
}

function CounterButtonC() {
  const [count, setCount] = useState(2);
  return <button onClick={() => setCount((i) => i + 2)}>2배수: {count}</button>;
}

function Parent() {
  return (
    <div className="count" style={{ gap: "1rem", marginBottom: "2rem" }}>
      <CounterButtonA />
      <CounterButtonB />
      <CounterButtonC />
    </div>
  );
}

/* =============================
      Main App
============================= */
export default function App() {
  const [bgIndex, setBgIndex] = useState(0);

  const videos = [
    "/videos/11.mp4",
    "/videos/22.mp4",
    "/videos/33.mp4",
    "/videos/44.mp4",
    "/videos/55.mp4",
    "/videos/66.mp4",
    "/videos/77.mp4",
    "/videos/88.mp4",
  ];

  const changeBackground = () => {
    const next = (bgIndex + 1) % videos.length;
    setBgIndex(next);

    const videoEl = document.getElementById("bg-video");
    if (videoEl) {
      videoEl.src = videos[next];
      videoEl.play();
    }
  };

  return (
    <>
      <button className="bg-change-btn" onClick={changeBackground}>
        배경 변경
      </button>

      <div className="card">
        <Parent />
        <TodoApp />
      </div>
    </>
  );
}
