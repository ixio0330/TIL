import { useRef } from "react";
import { useRecoilState } from "recoil";
import { todoListState } from "./state";
import * as uuid from 'uuid';

export default function TodoInput() {
  const todoRef = useRef(null);
  const [todoList, setTodoList] = useRecoilState(todoListState);
  function updateTodo({ target: { value }}) {
    todoRef.current.value = value;
  }
  function insertTodo() {
    if (!todoRef.current.value) return;
    setTodoList(todoList.concat({
      id: uuid.v1(),
      text: todoRef.current.value,
      done: false,
    }));
    todoRef.current.value = '';
  }
  function onKeyUp({ keyCode }) {
    if (keyCode === 13) {
      insertTodo();
    }
  }

  return (
    <div>
      <input ref={todoRef} type="text" onChange={updateTodo} onKeyUp={onKeyUp} />
      <button onClick={insertTodo}>+</button>
    </div>
  );
}