import TodoItem from './todoItem';

export default function TodoList({ todos, onToggle, onRemove }) {
  return (
    <ul data-testid="todoList">
      {
        todos.map((todo) => 
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onToggle={onToggle} 
            onRemove={onRemove} 
          />
        )
      }
    </ul>
  );
}