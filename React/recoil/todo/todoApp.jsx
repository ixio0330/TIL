import TodoFilters from "./todoFilters";
import TodoInput from "./todoInput";
import TodoList from "./todoList";

export default function TodoApp() {
  return (
    <>
      <TodoFilters />
      <TodoInput />
      <TodoList />
    </>
  );
}