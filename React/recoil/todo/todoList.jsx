import { useRecoilValue } from "recoil";
import { todoListFilterState } from "./state";
import TodoItem from "./todoItem";

export default function TodoList() {
  const todoList = useRecoilValue(todoListFilterState);
  return (
    <ul>
      {
        todoList.map((todo) => <TodoItem key={todo.id} todo={todo} />)
      }
    </ul>
  );
}