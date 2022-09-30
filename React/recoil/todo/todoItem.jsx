import { useRecoilState } from "recoil";
import { todoListState } from "./state";

export default function TodoItem({ todo }) {
  const { id, text, done } = todo;
  const [todoList, setTodoList] = useRecoilState(todoListState);
  function updateDone() {
    setTodoList(todoList.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo));
  }
  function deleteTodo(e) {
    e.stopPropagation();
    setTodoList(todoList.filter(todo => todo.id !== id));
  }
  const todoItemStyle = {
    textDecoration: done ? 'line-through' : 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '200px',
  };
  return (
    <li 
      style={todoItemStyle} 
      id={id}
      onClick={updateDone}
    >
      <span>{ text }</span>
      <span onClick={deleteTodo}>Delete</span>
    </li>
  )
}