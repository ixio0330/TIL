import { useCallback } from "react";
import { useRef } from "react";
import { useState } from "react"
import TodoInput from "./todoInput"
import TodoList from "./todoList"

export default function TodoApp() {
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: 'TDD',
      done: true
    },
    {
      id: 2,
      text: 'react-testing-library',
      done: false
    }
  ]);
  const nextId = useRef(3);
  const onInsert = useCallback((text) => {
    setTodos(todos.concat({ id: nextId.current, text, done: false}));
    nextId.current++;
  }, [todos]);
  const onToogle = useCallback((id) => {
    setTodos(
      todos.map((todo) => todo.id === id ? {...todo, done: !todo.done} : todo)
    );
  }, [todos]);
  const onRemove = useCallback((id) => {
    setTodos(
      todos.filter((todo) => todo.id !== id)
    );
  }, [todos]);

  return (
    <>
      <TodoInput onInsert={onInsert} />
      <TodoList todos={todos} onToggle={onToogle} onRemove={onRemove} />
    </>
  )
}